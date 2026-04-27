import {
  Avatar,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "@/contexts/AuthContext";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  if (user) {
    navigate("/");
  }

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, pass: rule.test(password) })),
    [password]
  );
  const allPasswordRulesPassed = passwordChecks.every((r) => r.pass);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (username.length < 3 || username.length > 32 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username must be 3-32 characters (letters, numbers, underscores)");
      return;
    }
    if (!allPasswordRulesPassed) {
      setError("Password does not meet all requirements");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/users/register", {
        username,
        password,
      });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already taken. Please choose another.");
      } else if (err.response?.status === 400) {
        setError("Invalid username or password format.");
      } else {
        setError("Registration failed. Please try again later.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0a0020 0%, #1a0040 50%, #0d0025 100%)"
            : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #e3f2fd 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 10, 60, 0.85)"
              : "rgba(255, 255, 255, 0.95)",
          border: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(210, 128, 255, 0.15)"
              : "1px solid rgba(25, 118, 210, 0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              boxShadow: (theme) =>
                `0 4px 20px ${theme.palette.mode === "dark" ? "rgba(210, 128, 255, 0.3)" : "rgba(25, 118, 210, 0.3)"}`,
            }}
          >
            <PersonAddOutlinedIcon sx={{ fontSize: 30, color: (theme) => theme.palette.mode === "dark" ? "#190042" : "#fff" }} />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ letterSpacing: "-0.02em" }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: -1.5 }}>
            Sign up for CLMS Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: "100%", borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            fullWidth
            variant="outlined"
            label="Username"
            placeholder="3-32 characters (letters, numbers, _)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="username"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            placeholder="Enter a strong password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="new-password"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Password strength checklist */}
          {password.length > 0 && (
            <Box sx={{ width: "100%", pl: 1 }}>
              {passwordChecks.map((rule) => (
                <Box
                  key={rule.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    mb: 0.3,
                  }}
                >
                  {rule.pass ? (
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 18, color: "success.main" }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      sx={{ fontSize: 18, color: "error.main" }}
                    />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: rule.pass ? "success.main" : "text.secondary",
                    }}
                  >
                    {rule.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            placeholder="Re-enter your password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="new-password"
            error={confirmPassword.length > 0 && password !== confirmPassword}
            helperText={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "Passwords do not match"
                : ""
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleRegister}
            disabled={loading || !!success}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: (theme) =>
                `0 4px 14px ${theme.palette.mode === "dark" ? "rgba(210, 128, 255, 0.25)" : "rgba(25, 118, 210, 0.25)"}`,
              "&:hover": {
                boxShadow: (theme) =>
                  `0 6px 20px ${theme.palette.mode === "dark" ? "rgba(210, 128, 255, 0.35)" : "rgba(25, 118, 210, 0.35)"}`,
              },
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Already have an account?{" "}
            <MuiLink
              component={Link}
              to="/login"
              sx={{ fontWeight: 600, textDecoration: "none" }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
