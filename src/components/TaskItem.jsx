import { useEffect, useRef, useState } from "react";
import { TAGS } from "../lib/constants.js";
import { formatTime } from "../lib/time.js";

export default function TaskItem({
  task,
  enter,
  onEnterDone,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) {
  const tag = TAGS[task.tag] || TAGS.personal;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = (save) => {
    if (!editing) return;
    const v = draft.trim();
    if (save && v && v !== task.text) onEdit(task.id, v);
    setEditing(false);
    if (save && v) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
    }
  };

  return (
    <li
      data-id={task.id}
      className={"task" + (task.done ? " done" : "") + (enter ? " enter" : "")}
      style={{ "--tagc": tag.c }}
      draggable={!editing}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id, e.currentTarget);
      }}
      onDragEnd={(e) => onDragEnd(e.currentTarget)}
      onAnimationEnd={(e) => {
        if (e.animationName === "slideIn") onEnterDone(task.id);
      }}
    >
      <button
        className="tick"
        type="button"
        aria-pressed={task.done}
        aria-label={task.done ? "Mark as not done" : "Mark as done"}
        title="Toggle done"
        onClick={() => onToggle(task.id)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5.5 12.5l4 4L18.5 8" />
        </svg>
      </button>
      <div className="task__body min-w-0 flex-1" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <input
            ref={inputRef}
            className="edit-in"
            value={draft}
            maxLength={140}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(true);
              else if (e.key === "Escape") commit(false);
            }}
            onBlur={() => commit(true)}
          />
        ) : (
          <p className={"task__text" + (flash ? " flash" : "")}>{task.text}</p>
        )}
        <div className="task__meta mt-[7px] flex flex-wrap items-center gap-2 font-mono text-[10.5px] tracking-[0.05em] text-ink/50">
          <span className="dot" />
          <span className="tagname">{tag.label}</span>
          <span className="sep">·</span>
          <time>{formatTime(task.created)}</time>
          {task.urgent && <span className="urg">⚑ urgent</span>}
        </div>
      </div>
      <div className="task__acts">
        <span className="grip" title="Drag to reorder" aria-hidden="true">
          ⋮⋮
        </span>
        <button
          className="ibtn"
          type="button"
          aria-label="Edit task"
          title="Edit"
          onClick={() => {
            setDraft(task.text);
            setEditing(true);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20l4.5-1L20 7.5 16.5 4 5 15.5 4 20z" />
          </svg>
        </button>
        <button
          className="ibtn ibtn--del"
          type="button"
          aria-label="Delete task"
          title="Delete"
          onClick={(e) => onDelete(task.id, e.currentTarget.closest(".task"))}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7h14M9.5 7V5h5v2M7 7l1 13h8l1-13" />
          </svg>
        </button>
      </div>
    </li>
  );
}
