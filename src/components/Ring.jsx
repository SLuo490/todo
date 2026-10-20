import { CIRC } from "../lib/constants.js";

export default function Ring({ done, total, ringRef }) {
  const frac = total > 0 ? done / total : 0;
  return (
    <div className="ring-wrap" ref={ringRef}>
      <svg className="ring-svg" viewBox="0 0 76 76" aria-hidden="true">
        <circle className="ring__track" cx="38" cy="38" r="32" />
        <circle
          className="ring__fill"
          cx="38"
          cy="38"
          r="32"
          style={{ strokeDasharray: CIRC, strokeDashoffset: CIRC * (1 - frac) }}
        />
      </svg>
      <div className="ring__label">
        <strong>
          {done}
          /{total}
        </strong>
        <span>done</span>
      </div>
    </div>
  );
}
