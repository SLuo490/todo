import { useRef, useState } from "react";
import { TAGS } from "../lib/constants.js";

export default function Composer({ selTag, onSelTag, onAdd, inputRef }) {
  const [value, setValue] = useState("");
  const [prio, setPrio] = useState(false);
  const sectionRef = useRef(null);

  const shake = () => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  };

  const submit = () => {
    const v = value.trim();
    if (!v) {
      shake();
      inputRef.current?.focus();
      return;
    }
    onAdd(v, prio);
    setValue("");
    setPrio(false);
    inputRef.current?.focus();
  };

  return (
    <section
      className="composer"
      data-reveal
      style={{ "--d": 1 }}
      ref={sectionRef}
    >
      <div className="composer__row flex items-center gap-3">
        <span className="composer__plus" aria-hidden="true">
          +
        </span>
        <input
          ref={inputRef}
          type="text"
          maxLength={140}
          autoComplete="off"
          placeholder="What needs doing?"
          aria-label="New task"
          className="composer__input flex min-w-0 flex-1 border-0 bg-transparent py-1.5 text-[1.14rem] font-medium text-ink outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") setValue("");
          }}
        />
        <button className="btn--add" type="button" onClick={submit}>
          Add <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="composer__opts mt-[13px] flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-dashed border-ink/20 pt-[13px]">
        <div
          className="chips flex flex-wrap gap-2"
          role="group"
          aria-label="Tag for new task"
        >
          {Object.entries(TAGS).map(([key, tag]) => (
            <button
              key={key}
              type="button"
              className={"chip" + (selTag === key ? " on" : "")}
              style={{ "--tagc": tag.c }}
              aria-pressed={selTag === key}
              onClick={() => {
                onSelTag(key);
                inputRef.current?.focus();
              }}
            >
              <span className="dot" />
              {tag.label}
            </button>
          ))}
        </div>
        <button
          className={"flag" + (prio ? " on" : "")}
          type="button"
          aria-pressed={prio}
          title="Flag as urgent"
          onClick={() => setPrio(!prio)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 21V4h11l-2.5 4L16 12H5" />
          </svg>
          Urgent
        </button>
      </div>
    </section>
  );
}
