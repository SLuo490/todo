import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { load, save, seed } from "./lib/storage.js";
import { uid } from "./lib/utils.js";
import { burst } from "./lib/confetti.js";
import { weekdayLong } from "./lib/time.js";
import Background from "./components/Background.jsx";
import Header from "./components/Header.jsx";
import Composer from "./components/Composer.jsx";
import Toolbar from "./components/Toolbar.jsx";
import TaskList from "./components/TaskList.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";

let toastSeq = 0;

export default function App() {
  const [state, setState] = useState(() => load() || seed());
  const stateRef = useRef(state);
  const [toast, setToast] = useState(null);
  const [savePing, setSavePing] = useState(0);
  const [enterId, setEnterId] = useState(null);
  const warnedRef = useRef(false);
  const removingRef = useRef(false);
  const bootedRef = useRef(false);
  const ringRef = useRef(null);
  const confettiRef = useRef(null);
  const inputRef = useRef(null);

  const weekday = useMemo(() => weekdayLong(new Date()), []);

  /* ---------- state plumbing ---------- */
  const showToast = (msg, label, onAct, dur = 4500) =>
    setToast({ id: ++toastSeq, msg, label, onAct, dur });
  const closeToast = useCallback(() => setToast(null), []);

  const persist = (next) => {
    if (save(next)) setSavePing((p) => p + 1);
    else if (!warnedRef.current) {
      warnedRef.current = true;
      showToast("Storage unavailable — changes may not persist");
    }
  };
  const commit = (updater) => {
    const next =
      typeof updater === "function" ? updater(stateRef.current) : updater;
    stateRef.current = next;
    setState(next);
    persist(next);
  };
  const update = (updater) => {
    const next =
      typeof updater === "function" ? updater(stateRef.current) : updater;
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    persist(stateRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- derived ---------- */
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.done).length;
  const visible =
    state.filter === "all"
      ? state.tasks
      : state.tasks.filter((t) =>
          state.filter === "active" ? !t.done : t.done,
        );

  /* ---------- actions ---------- */
  const addTask = (text, urgent) => {
    const t = {
      id: uid(),
      text,
      tag: state.selTag,
      urgent,
      done: false,
      created: Date.now(),
    };
    commit((s) => ({
      ...s,
      tasks: [t, ...s.tasks],
      filter: s.filter === "done" ? "all" : s.filter,
    }));
    setEnterId(t.id);
  };

  const toggleTask = (id) => {
    const prev = stateRef.current.tasks;
    const wasAll = prev.length > 0 && prev.every((t) => t.done);
    commit((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
    const next = stateRef.current.tasks;
    if (next.length > 0 && next.every((t) => t.done) && !wasAll)
      burst(ringRef.current, confettiRef.current);
  };

  const removeTask = (id, li) => {
    const s = stateRef.current;
    const idx = s.tasks.findIndex((t) => t.id === id);
    if (idx < 0 || removingRef.current) return;
    const t = s.tasks[idx];
    if (li) {
      removingRef.current = true;
      li.style.transition =
        "height .28s ease, opacity .22s ease, transform .28s ease, padding .28s ease";
      li.style.height = li.offsetHeight + "px";
      void li.getBoundingClientRect();
      li.style.height = "0px";
      li.style.paddingTop = "0";
      li.style.paddingBottom = "0";
      li.style.opacity = "0";
      li.style.transform = "translateX(28px) scale(.96)";
    }
    setTimeout(
      () => {
        removingRef.current = false;
        commit((st) => ({ ...st, tasks: st.tasks.filter((x) => x.id !== id) }));
        showToast("Task removed", "Undo", () => {
          commit((st) => {
            const arr = [...st.tasks];
            arr.splice(Math.min(idx, arr.length), 0, t);
            return { ...st, tasks: arr };
          });
        });
      },
      li ? 320 : 0,
    );
  };

  const editTask = (id, text) =>
    commit((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, text } : t)),
    }));

  const setFilter = (f) => commit((s) => ({ ...s, filter: f }));
  const setSelTag = (selTag) => commit((s) => ({ ...s, selTag }));

  const copyList = () => {
    const lines = state.tasks.map(
      (t) => `${t.done ? "[x]" : "[ ]"} ${t.text}${t.urgent ? "  ⚑" : ""}`,
    );
    const txt =
      `${weekday.replace(".", "").toLowerCase()} — ${lines.length} task(s)\n` +
      lines.join("\n");
    const ok = () => showToast("List copied to clipboard");
    const fail = () => showToast("Copy failed — clipboard blocked");
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(txt).then(ok, fail);
    else {
      const ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? ok() : fail();
      } catch (e) {
        fail();
      }
      ta.remove();
    }
  };

  const clearDone = () => {
    const s = stateRef.current;
    const doneTasks = s.tasks.filter((t) => t.done);
    if (!doneTasks.length) return;
    const snapshot = doneTasks.map((t) => ({ t, index: s.tasks.indexOf(t) }));
    commit((st) => ({ ...st, tasks: st.tasks.filter((t) => !t.done) }));
    showToast(
      `Cleared ${snapshot.length} finished ${snapshot.length === 1 ? "task" : "tasks"}`,
      "Undo",
      () => {
        commit((st) => {
          const arr = [...st.tasks];
          [...snapshot]
            .sort((a, b) => a.index - b.index)
            .forEach(({ t, index }) =>
              arr.splice(Math.min(index, arr.length), 0, t),
            );
          return { ...st, tasks: arr };
        });
      },
      6000,
    );
  };

  /* drag reorder: move dragId before targetId (or to the end) */
  const reorder = (dragId, targetId) => {
    const s = stateRef.current;
    const from = s.tasks.findIndex((t) => t.id === dragId);
    if (from < 0) return;
    if (targetId) {
      if (s.tasks[from + 1]?.id === targetId) return;
    } else if (from === s.tasks.length - 1) return;
    update((st) => {
      const arr = [...st.tasks];
      const [t] = arr.splice(from, 1);
      const to = targetId ? arr.findIndex((x) => x.id === targetId) : arr.length;
      arr.splice(to > -1 ? to : arr.length, 0, t);
      return { ...st, tasks: arr };
    });
  };
  const commitReorder = () => persist(stateRef.current);

  /* "/" focuses the composer */
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "/" &&
        !/INPUT|TEXTAREA/.test(document.activeElement.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Background />
      <div className="app relative mx-auto max-w-[920px] px-[clamp(16px,4vw,28px)] pt-[clamp(22px,4.5vw,48px)] pb-16">
        <Header done={done} total={total} ringRef={ringRef} weekday={weekday} />
        <Composer
          selTag={state.selTag}
          onSelTag={setSelTag}
          onAdd={addTask}
          inputRef={inputRef}
        />
        <Toolbar
          filter={state.filter}
          total={total}
          active={total - done}
          done={done}
          onFilter={setFilter}
          onCopy={copyList}
          onClear={clearDone}
        />
        {visible.length > 0 ? (
          <TaskList
            tasks={visible}
            enterId={enterId}
            onEnterDone={(id) => {
              if (enterId === id) setEnterId(null);
            }}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={removeTask}
            onReorder={reorder}
            onReorderCommit={commitReorder}
          />
        ) : (
          <EmptyState hasAny={total > 0} filter={state.filter} />
        )}
        <Footer savePing={savePing} />
      </div>
      <Toast toast={toast} onClose={closeToast} />
      <div ref={confettiRef} aria-hidden="true" />
    </>
  );
}
