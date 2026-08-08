export type CurrentItem = {
  label: string;
  value: string;
};

export const currentItems = [
  {
    label: "building",
    value: "ai security tools",
  },
  {
    label: "reading",
    value: "relentless by tim s. grover",
  },
  {
    label: "learning",
    value: "anything and everything",
  },
  {
    label: "thinking about",
    value: "how small tools become daily habits",
  },
] satisfies CurrentItem[];
