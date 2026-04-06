import { createContext, useState, ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme, purpleTheme } from "../theme/theme";

// type ThemeMode = "dark" | "light" | "purple";

// interface ThemeContextType {
//   themeMode: ThemeMode;
//   toggleTheme: (mode: ThemeMode) => void;
// }

export const ThemeContext = createContext(
  null
);

export const ThemeProviderWrapper = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    (localStorage.getItem("theme")) || "dark"
  );

  const toggleTheme = (mode) => {
    setThemeMode(mode);
    localStorage.setItem("theme", mode); // Lưu vào localStorage để duy trì theme khi load lại trang
  };

  const theme =
    themeMode === "dark"
      ? darkTheme
      : themeMode === "light"
      ? lightTheme
      : purpleTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
