import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      // Add the React plugin
      react: pluginReact,
    },
    rules: {
      // Disable prop-types validation
      "react/prop-types": "off", // Disable prop-types rule
      // Add other rules you might want to enforce or customize
      "react/jsx-uses-react": "off", // React is not required to be in scope for JSX
      "react/react-in-jsx-scope": "off", // Not required in React 17+
      // You can add more rules here as needed
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
