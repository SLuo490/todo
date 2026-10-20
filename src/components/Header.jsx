import { useNow } from "../hooks/useNow.js";
import { dateline, moodFor } from "../lib/time.js";
import Clock from "./Clock.jsx";
import Ring from "./Ring.jsx";

export default function Header({ done, total, ringRef, weekday }) {
  const now = useNow(1000);
  const allClear = total > 0 && done === total;

  return (
    <header
      className="top mb-7 flex flex-wrap items-end justify-between gap-[26px] max-sm:items-start"
      data-reveal
    >
      <div>
        <div className="brand mb-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-cream/55">
          <i className="inline-block h-[9px] w-[9px] rotate-45 bg-gold" />
          PAPER·PLAN
        </div>
        <h1 className="weekday">{weekday}</h1>
        <p className="dateline mt-3 flex flex-wrap items-baseline gap-2.5 font-mono text-xs tracking-[0.08em] text-cream/55">
          <span>{dateline(now)}</span>
          <span>·</span>
          <span className="mood">{moodFor(now.getHours())}</span>
        </p>
      </div>
      <div className="top__status relative flex flex-wrap items-center gap-6">
        <Clock now={now} />
        <Ring done={done} total={total} ringRef={ringRef} />
        <span className={"allclear" + (allClear ? " show" : "")} aria-hidden="true">
          ALL CLEAR
        </span>
      </div>
    </header>
  );
}
