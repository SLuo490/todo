export const KEY = "paperplan.v1";
export const CIRC = 2 * Math.PI * 32;

export const TAGS = {
  work: { label: "Work", c: "#FFB52E" },
  personal: { label: "Personal", c: "#57C78F" },
  ideas: { label: "Ideas", c: "#6FB9E8" },
  errands: { label: "Errands", c: "#F27DA0" },
};

export const CONFETTI_COLORS = [
  "#FFB52E",
  "#57C78F",
  "#FF5C3A",
  "#6FB9E8",
  "#F2EDDC",
];

export const REDUCED_MOTION =
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
