import { pad } from "../lib/time.js";

export default function Clock({ now }) {
  const h = now.getHours();
  const hh = (h % 12) || 12;
  return (
    <div>
      <span className="mb-[7px] block font-mono text-[9.5px] tracking-[0.26em] text-cream/55 uppercase">
        Local time
      </span>
      <time className="clock font-mono font-bold tracking-[0.02em] tabular-nums text-[clamp(1.5rem,3.6vw,2.05rem)]">
        {hh}
        <i>:</i>
        {pad(now.getMinutes())}
        <i>:</i>
        {pad(now.getSeconds())}
      </time>
    </div>
  );
}
