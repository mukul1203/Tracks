// Shared design tokens so every screen feels like one app.
// Palette is tuned to sit on top of the dark "earth" background image.

export const colors = {
  primary: "#2E7DFF", // actionable blue
  primaryDark: "#1B5FD9",
  danger: "#E5484D",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.7)",
  textOnLight: "#1A1A1A",
  surface: "rgba(20,24,38,0.72)", // frosted card over the background
  surfaceSolid: "#141826",
  border: "rgba(255,255,255,0.15)",
  inputBg: "rgba(255,255,255,0.08)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

// react-navigation header styling shared by the stacks.
export const navHeader = {
  headerStyle: { backgroundColor: colors.surfaceSolid },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: "700" },
  headerShadowVisible: false,
};
