import { CONFETTI_COLORS, REDUCED_MOTION } from "./constants";

/** Fire a confetti burst from the center of `ringEl` into `hostEl`. */
export function burst(ringEl, hostEl) {
  if (REDUCED_MOTION || !ringEl || !hostEl) return;
  const r = ringEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 64; i++) {
    const p = document.createElement("i");
    p.className = "cf";
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    p.style.left = cx + "px";
    p.style.top = cy + "px";
    hostEl.appendChild(p);
    const a = Math.random() * Math.PI * 2;
    const v = 70 + Math.random() * 150;
    const dx = Math.cos(a) * v;
    const dy = Math.sin(a) * v - 90;
    const rot = Math.random() * 720 - 360;
    p
      .animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${dx * 0.8}px), calc(-50% + ${
              dy - 30
            }px)) rotate(${rot * 0.6}deg)`,
            opacity: 1,
            offset: 0.55,
          },
          {
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${
              dy + 240
            }px)) rotate(${rot}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 900 + Math.random() * 600,
          easing: "cubic-bezier(.15,.6,.3,1)",
        },
      )
      .onfinish = () => p.remove();
  }
}
