export const USER_COLORS = [
  { id: "blue", name: "Azul", primary: "#338CD5", dark: "#2168A4" },
  { id: "purple", name: "Roxo", primary: "#9367EB", dark: "#6E32CF" },
  { id: "rose", name: "Rose", primary: "#D75870", dark: "#A92B45" },
  { id: "green", name: "Verde", primary: "#55C06E", dark: "#2A7C3F" },
  { id: "orange", name: "Laranja", primary: "#F69F40", dark: "#B25900" },
  { id: "teal", name: "Azul Piscina", primary: "#2DD4BF", dark: "#117366" },
  { id: "pink", name: "Rosa", primary: "#EC4899", dark: "#A31A60" },
];

export const USER_COLOR_IDS = USER_COLORS.map((c) => c.id);

export const GROUP_THEMES = [
  {
    id: "blue",
    name: "Azul Clássico",
    primary: "#205FE2",
    secondary: "#29A4FF",
  },
  {
    id: "purple",
    name: "Roxo Místico",
    primary: "#A23BD1",
    secondary: "#B27AF1",
  },
  {
    id: "emerald",
    name: "Esmeralda",
    primary: "#2CA886",
    secondary: "#55C06E",
  },
  { id: "coral", name: "Coral", primary: "#F7516A", secondary: "#FA818D" },
  {
    id: "amber",
    name: "Laranja Pôr do Sol",
    primary: "#FA7F39",
    secondary: "#F69F40",
  },
  { id: "violet", name: "Violeta", primary: "#613FE5", secondary: "#855CF4" },
];

export const GROUP_THEME_IDS = GROUP_THEMES.map((t) => t.id);

export const getUserColor = (id) =>
  USER_COLORS.find((c) => c.id === id) || USER_COLORS[0];

export const getRandomUserColor = () => {
  const randomIndex = Math.floor(Math.random() * USER_COLORS.length);

  return USER_COLORS[randomIndex].id;
};

export const getGroupTheme = (id) =>
  GROUP_THEMES.find((t) => t.id === id) || GROUP_THEMES[0];

export const getRandomGroupTheme = () => {
  const randomIndex = Math.floor(Math.random() * GROUP_THEMES.length);

  return GROUP_THEMES[randomIndex].id;
};
