export function pad(n) {
  return String(n).padStart(2, "0");
}

export function moodFor(h) {
  if (h < 5) return "Night-owl hours";
  if (h < 11) return "Morning — set the tone";
  if (h < 14) return "Midday push";
  if (h < 18) return "Steady hands, afternoon";
  if (h < 22) return "Evening wrap-up";
  return "Wind it down";
}

export function weekdayLong(d) {
  return d.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase();
}

export function dateline(d) {
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
