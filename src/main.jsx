import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const hasModifier = e.ctrlKey || e.metaKey;

  if (
    e.key === "F12" ||
    (hasModifier && e.shiftKey && (key === "i" || key === "j" || key === "c")) ||
    (hasModifier && key === "u")
  ) {
    e.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
