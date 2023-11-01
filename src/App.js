import React from "react";
import "./config/firebaseConfig";
import RootNavigation from "./navigation";
import { ThemeProvider } from "react-native-elements";

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}
