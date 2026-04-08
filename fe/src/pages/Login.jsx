import { Avatar, Divider } from "@mui/material";
// import LockIcon from "@material-ui/icons/Lock";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Typography,
  Container,
  Table,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }
    , [user]);
  const handleLogin = async () => {
    // Call API to login
    // If success, navigate to home page
    // If fail, show error message
    try {
      const res = await axios.post("http://localhost:3000/users/login", {
        username: username,
        password: password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", res.data.username);
      setUser(res.data.username);
      navigate("/");
    } catch (error) {
      setError("Login failed, check your username and password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "background.default" }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: 2,
          pt: 10,
          minHeight: "100vh",
        }}
      >
        <Avatar
          sx={{
            backgroundColor: "secondary.main",
            color: "secondary",
          }}
        >
          {/* <LockIcon /> */}
        </Avatar>
        <TextField
          variant="outlined"
          label="username"
          sx={{
            width: "100%", // Full width of parent
            maxWidth: "500px", // Limit maximum width
            minWidth: "200px", // Ensure it doesn't shrink too much
          }}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="password"
          sx={{
            width: "100%", // Full width of parent
            maxWidth: "500px", // Limit maximum width
            minWidth: "200px", // Ensure it doesn't shrink too much
          }}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* or login via OAuth */}
        <Button
          variant="contained"
          sx={{
            width: "100%", // Full width of parent
            maxWidth: "500px", // Limit maximum width
            minWidth: "200px", // Ensure it doesn't shrink too much
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
        {error && (
          <Typography sx={{ color: "error.main" }}>{error}</Typography>
        )}
      </Container>
    </Box>
  );
}
