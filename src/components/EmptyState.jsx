export default function EmptyState({ hasAny, filter }) {
  let title = "All clear.";
  let sub = "Everything is checked off. Enjoy the quiet.";
  if (!hasAny) {
    title = "A clean page.";
    sub = "Add your first task above — it lives in this browser, nowhere else.";
  } else if (filter === "done") {
    title = "Nothing finished yet.";
    sub = "Tick something off and it will land here.";
  }

  return (
    <div className="empty" data-reveal style={{ "--d": 3 }}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 6c14-3 28 8 29 22 1 15-11 27-26 28C20 57 7 47 6 33 5 19 18 9 32 6z"
          fill="none"
          stroke="#FFB52E"
          strokeWidth="3"
        />
        <path
          d="M20 33l9 9 16-19"
          fill="none"
          stroke="#57C78F"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
    </div>
  );
}
