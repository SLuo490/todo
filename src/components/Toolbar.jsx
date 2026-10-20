const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

export default function Toolbar({
  filter,
  total,
  active,
  done,
  onFilter,
  onCopy,
  onClear,
}) {
  const counts = { all: total, active, done };
  return (
    <section
      className="toolbar mx-0.5 mb-3.5 mt-[26px] flex flex-wrap items-center justify-between gap-3.5"
      data-reveal
      style={{ "--d": 2 }}
    >
      <div
        className="tabs inline-flex gap-0.5 rounded-full border border-line bg-cream/[0.06] p-1"
        role="tablist"
        aria-label="Filter tasks"
      >
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={"tab" + (filter === f.key ? " on" : "")}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => onFilter(f.key)}
          >
            {f.label} <b>{counts[f.key]}</b>
          </button>
        ))}
      </div>
      <div className="toolbar__right flex flex-wrap items-center gap-2.5">
        <span className="count font-mono text-[11.5px] tracking-[0.08em] text-cream/55" aria-live="polite">
          {total - done} left
        </span>
        <button className="ghost" type="button" onClick={onCopy}>
          Copy list
        </button>
        <button
          className="ghost ghost--warn"
          type="button"
          disabled={!done}
          onClick={onClear}
        >
          Clear done
        </button>
      </div>
    </section>
  );
}
