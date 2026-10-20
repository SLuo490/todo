import { KEY, TAGS } from "./constants";
import { uid } from "./utils";

export function seed() {
  const n = Date.now();
  return {
    filter: "all",
    selTag: "personal",
    tasks: [
      {
        id: uid(),
        text: "Reply to Maya about Friday",
        tag: "work",
        urgent: false,
        done: false,
        created: n - 5 * 3600e3,
      },
      {
        id: uid(),
        text: "Steal a good idea for the pitch",
        tag: "ideas",
        urgent: true,
        done: false,
        created: n - 3 * 3600e3,
      },
      {
        id: uid(),
        text: "Water the monstera",
        tag: "personal",
        urgent: false,
        done: false,
        created: n - 2 * 3600e3,
      },
      {
        id: uid(),
        text: "Stretch for ten minutes",
        tag: "personal",
        urgent: false,
        done: true,
        created: n - 40 * 60e3,
      },
    ],
  };
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (Array.isArray(d.tasks))
        return {
          tasks: d.tasks,
          filter: d.filter || "all",
          selTag: TAGS[d.selTag] ? d.selTag : "personal",
        };
    }
  } catch (e) {}
  return null;
}

/** Persist state. Returns false when storage is unavailable. */
export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}
