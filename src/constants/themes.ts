export const themeStyles: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  vsDark: {
    bg: "#1E1E1E",
    border: "#333333",
    text: "#E0E0E0", // Softer light gray for less contrast strain
  },
  vsLight: {
    bg: "#FFFFFF",
    border: "#E0E0E0",
    text: "#333333", // Dark gray for a softer appearance than pure black
  },
  dracula: {
    bg: "#282A36",
    border: "#44475A",
    text: "#F8F8F2", // Off-white for better readability
  },
  github: {
    bg: "#F6F8FA",
    border: "#E1E4E8",
    text: "#333333", // Dark gray for a modern, less harsh alternative to black
  },
  nightOwl: {
    bg: "#011627",
    border: "#3C4858",
    text: "#A0C6FF", // Light blue for a calming, more colorful choice
  },
  oceanicNext: {
    bg: "#282C34",
    border: "#44475A",
    text: "#A6E3E9", // Soft cyan to complement the dark theme
  },
  palenight: {
    bg: "#292D3E",
    border: "#4B4E61",
    text: "#A8A8FF", // Lighter lavender for a soft contrast
  },
  shadesOfPurple: {
    bg: "#2D2A55",
    border: "#4E4872",
    text: "#D8B7FF", // Light purple for an elegant touch
  },
  duotoneDark: {
    bg: "#2A2734",
    border: "#3E3849",
    text: "#D4D4FF", // Light lavender for contrast and readability
  },
  duotoneLight: {
    bg: "#FAF8F5",
    border: "#D1D1D1",
    text: "#5A5A5A", // Medium gray for reduced contrast
  },
  gruvboxMaterialDark: {
    bg: "#292828",
    border: "#3E3A3A",
    text: "#EBDBB2", // Warm off-white to balance the dark tones
  },
  gruvboxMaterialLight: {
    bg: "#F9F5D7",
    border: "#E2DBA7",
    text: "#3C3836", // Darker brown for improved contrast without black
  },
  jettwaveDark: {
    bg: "#011627",
    border: "#3C4858",
    text: "#A0C6FF", // Light blue for a calm and vibrant appearance
  },
  jettwaveLight: {
    bg: "#F1F5F9",
    border: "#D1D9E6",
    text: "#4A4A4A", // Medium gray for less sharp contrast
  },
  nightOwlLight: {
    bg: "#FBFBFB",
    border: "#D1D1D1",
    text: "#505050", // Dark gray instead of black for a softer feel
  },
  okaidia: {
    bg: "#272822",
    border: "#3E3A3A",
    text: "#F8F8F2", // Light gray for a more comfortable read
  },
  oneDark: {
    bg: "#282C34",
    border: "#44475A",
    text: "#B0BEC5", // Soft blue-gray for a relaxing vibe
  },
  oneLight: {
    bg: "#FAFAFA",
    border: "#D1D1D1",
    text: "#4A4A4A", // Medium gray to reduce harshness of black
  },
  synthwave84: {
    bg: "#2D2A55",
    border: "#4E4872",
    text: "#FF77FF", // Bright pinkish-purple for a neon feel
  },
  ultramin: {
    bg: "#FFFFFF",
    border: "#E0E0E0",
    text: "#333333", // Dark gray for better legibility
  },
};


export const AVAILABLE_CARD_THEMES = [
    { value: "default", label: "Default" },
    { value: "minimal", label: "Minimal" },
    { value: "defaultColorLess", label: "Color Less" },
    { value: "leftName", label: "Left Name" },
    { value: "centerName", label: "Center Name" },
    { value: "rightName", label: "Right Name" },
    { value: "window", label: "Window" },
  ];

export const LANGUAGE_OPTIONS = [
  "markup", "jsx", "tsx", "swift", "kotlin", "objectivec", "js-extras",
  "reason", "rust", "graphql", "yaml", "go", "cpp", "markdown", "python", "json"
];