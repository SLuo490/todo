import { useRef } from "react";
import TaskItem from "./TaskItem.jsx";

/* first card (other than the dragged one) whose midpoint is below the cursor */
function afterElement(ul, y, draggingEl) {
  const els = [...ul.querySelectorAll(".task:not(.dragging)")];
  let closest = { off: -Infinity, el: null };
  for (const el of els) {
    const b = el.getBoundingClientRect();
    const off = y - b.top - b.height / 2;
    if (off < 0 && off > closest.off) closest = { off, el };
  }
  return closest.el;
}

export default function TaskList({
  tasks,
  enterId,
  onEnterDone,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onReorderCommit,
}) {
  const dragIdRef = useRef(null);
  const draggingElRef = useRef(null);

  return (
    <ul
      className="list mt-1 grid gap-[11px]"
      aria-label="Tasks"
      data-reveal
      style={{ "--d": 3 }}
      onDragOver={(e) => {
        if (!dragIdRef.current) return;
        e.preventDefault();
        const after = afterElement(e.currentTarget, e.clientY, draggingElRef.current);
        onReorder(dragIdRef.current, after ? after.dataset.id : null);
      }}
      onDrop={(e) => e.preventDefault()}
    >
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          enter={enterId === t.id}
          onEnterDone={onEnterDone}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={(id, li) => {
            dragIdRef.current = id;
            draggingElRef.current = li;
            requestAnimationFrame(() => li.classList.add("dragging"));
          }}
          onDragEnd={(li) => {
            li.classList.remove("dragging");
            dragIdRef.current = null;
            draggingElRef.current = null;
            onReorderCommit();
          }}
        />
      ))}
    </ul>
  );
}
