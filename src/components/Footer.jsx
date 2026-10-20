export default function Footer({ savePing }) {
  return (
    <footer
      className="foot mt-11 flex flex-wrap justify-between gap-3.5 font-mono text-[10.5px] tracking-[0.06em] text-cream/45 leading-loose"
      data-reveal
      style={{ "--d": 4 }}
    >
      <p>
        <kbd>/</kbd> focus &nbsp;·&nbsp; <kbd>Enter</kbd> add &nbsp;·&nbsp;
        double-click a task to edit &nbsp;·&nbsp; drag to reorder
      </p>
      <p className="foot__save inline-flex items-center gap-[9px] self-center">
        <span key={savePing} className={"sdot" + (savePing ? " ping" : "")} />
        Saved locally in this browser — data never leaves
      </p>
    </footer>
  );
}
