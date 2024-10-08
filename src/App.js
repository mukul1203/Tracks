import React from "react";
import "./config/firebaseConfig";
import { ThemeProvider } from "react-native-elements";
import RootNavigation from "./navigation/RootNavigation";

export default function App() {
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}
