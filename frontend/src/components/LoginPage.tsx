import { useState, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import backgroundLogin from "../images/backgroung-login.svg";
import logoLogin from "../images/logo-login.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "11vh",
      }}
    >
      {/* Background decorativo */}
      <Box
        component="img"
        src={backgroundLogin}
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Conteúdo central */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          px: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2} fontSize={40}>
          Login
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={6} fontSize={20}>
          Faça login para continuar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            placeholder="Digite seu e-mail"
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 3,
              width: "100%",
              maxWidth: 512,
              "& .MuiInputBase-root": { height: 56 },
            }}
          />
          <TextField
            label="Senha"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Digite sua senha"
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 5,
              width: "100%",
              maxWidth: 512,
              "& .MuiInputBase-root": { height: 56 },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <Visibility sx={{ color: "text.primary" }} />
                    ) : (
                      <VisibilityOff sx={{ color: "text.primary" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mb: 2,
              width: "100%",
              maxWidth: 512,
              height: 56,
              bgcolor: "black",
              color: "white",
              borderRadius: 1,
              textTransform: "none",
              fontWeight: 500,
              fontSize: 16,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </Button>
          <Typography
            variant="body2"
            color="black"
            textAlign="center"
            sx={{ width: "100%", maxWidth: 512 }}
          >
            Não tem conta?{" "}
            <Button
              size="small"
              onClick={onSwitchToRegister}
              sx={{
                textTransform: "none",
                color: "#e57373",
                fontWeight: 500,
                minWidth: "auto",
                p: 0,
                ml: 0,
              }}
            >
              Cadastra-se
            </Button>
          </Typography>
        </Box>
      </Box>

      {/* Logo no rodapé */}
      <Box
        component="img"
        src={logoLogin}
        alt="taskflow"
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: {
            xs: "translateX(-58%)",
            sm: "translateX(-50%)",
          },
          zIndex: 1,
          width: 219,
          height: 62,
        }}
      />
    </Box>
  );
}
