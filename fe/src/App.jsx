import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Box, Container } from "@mui/material";

export default function App() {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      <Container
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
