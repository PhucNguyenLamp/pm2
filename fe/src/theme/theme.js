import { createTheme } from "@mui/material/styles";


const purpleTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d280ff",
    },
    secondary: {
      main: "#5a3199",
    },
    text: {
      primary: "#e2b2dc",
      secondary: "#7a4697",
    },
    background: {
      default: "#190042",
      paper: "#370554",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff", // Trắng
    },
    secondary: {
      main: "#b0b0b0", // Xám nhạt
    },
    text: {
      primary: "#e0e0e0", // Xám rất nhạt
      secondary: "#a0a0a0", // Xám trung bình
    },
    background: {
      default: "#121212", // Đen gần như hoàn toàn
      paper: "#1e1e1e", // Xám đậm hơn cho nền giấy
    },
    error: {
      main: "#ff4c4c", // Đỏ tươi
    },
    warning: {
      main: "#ff9800", // Cam
      light: "#e68a00", // Cam nhạt hơn
    },
    info: {
      main: "#2196f3", // Xanh dương
    },
    success: {
      main: "#4caf50", // Xanh lá
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h3: {
      color: "#e0e0e0", // Xám rất nhạt cho tiêu đề
    },
    body1: {
      color: "#e0e0e0", // Xám rất nhạt cho nội dung chính
    },
    body2: {
      color: "#a0a0a0", // Xám trung bình cho nội dung phụ
    },
  },
});

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export { darkTheme, lightTheme, purpleTheme };