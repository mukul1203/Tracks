import React from "react";
import "./config/firebaseConfig";
import { ThemeProvider } from "react-native-elements";
import RootNavigation from "./navigation/RootNavigation";

export default function App() {
  return (
    // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'ThemeProv... Remove this comment to see the full error message
    <ThemeProvider>
      // @ts-expect-error TS(2749): 'RootNavigation' refers to a value, but is being u... Remove this comment to see the full error message
      <RootNavigation />
    </ThemeProvider>
  );
}
