export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg-dots" />
      <div className="bg-glow bg-glow--gold" />
      <div className="bg-glow bg-glow--mint" />
      <svg className="star star--a" viewBox="0 0 100 100" aria-hidden="true">
        <g stroke="rgba(255,181,46,.55)" strokeWidth="9" strokeLinecap="round">
          <line x1="50" y1="8" x2="50" y2="92" />
          <line x1="8" y1="50" x2="92" y2="50" />
          <line x1="21" y1="21" x2="79" y2="79" />
          <line x1="79" y1="21" x2="21" y2="79" />
        </g>
      </svg>
      <svg className="star star--b" viewBox="0 0 100 100" aria-hidden="true">
        <g stroke="rgba(87,199,143,.5)" strokeWidth="10" strokeLinecap="round">
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </g>
      </svg>
      <div className="grain" />
    </div>
  );
}
