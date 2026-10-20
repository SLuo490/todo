import { useEffect, useRef } from "react";

export default function Toast({ toast, onClose }) {
  const lastRef = useRef(null);
  if (toast) lastRef.current = toast;
  const shown = lastRef.current;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, toast.dur);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  return (
    <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">
      <span>{shown ? shown.msg : ""}</span>
      {shown?.label && (
        <button
          type="button"
          onClick={() => {
            onClose();
            shown.onAct?.();
          }}
        >
          {shown.label}
        </button>
      )}
      {shown && (
        <div
          key={shown.id}
          className="bar"
          style={{ animation: `drain ${shown.dur}ms linear forwards` }}
        />
      )}
    </div>
  );
}
