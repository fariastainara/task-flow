import { useState, useRef, FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCameraOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import backgroundLogin from "../images/backgroung-login.svg";
import logoLogin from "../images/logo-login.svg";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface Props {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, avatar ?? undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar");
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
        paddingBottom: "13vh",
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
          maxWidth: 540,
          px: 3,
        }}
      >
        {/* Título + Avatar lado a lado */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} mb={2} fontSize={40}>
              Crie uma conta
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={3}
              fontSize={20}
            >
              Preencha os dados para se cadastrar
            </Typography>
          </Box>
          <Box sx={{ position: "relative", flexShrink: 0, ml: 3, mt: 10 }}>
            <Avatar
              src={avatar ?? undefined}
              sx={{
                width: 50,
                height: 50,
                bgcolor: avatar ? "transparent" : "white",
                border: avatar ? "none" : "1px solid black",
                color: "text.secondary",
              }}
            >
              {!avatar && name ? (
                getInitials(name)
              ) : !avatar ? (
                <PersonOutlinedIcon sx={{ fontSize: 36 }} />
              ) : null}
            </Avatar>
            <Tooltip title={avatar ? "Trocar foto" : "Adicionar foto"}>
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  bgcolor: "white",
                  color: "text.secondary",
                  border: "1px solid #ccc",
                  "&:hover": { bgcolor: "grey.100" },
                  width: 24,
                  height: 24,
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            {avatar && (
              <Tooltip title="Remover foto">
                <IconButton
                  size="small"
                  onClick={() => {
                    setAvatar(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    bgcolor: "error.main",
                    color: "white",
                    "&:hover": { bgcolor: "error.dark" },
                    width: 20,
                    height: 20,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Tooltip>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="name"
            InputLabelProps={{ shrink: true }}
            placeholder="Digite seu nome"
            sx={{
              mb: 3,
              width: "100%",
              maxWidth: 512,
              "& .MuiInputBase-root": { height: 56 },
            }}
          />
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            InputLabelProps={{ shrink: true }}
            placeholder="Digite seu e-mail"
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
            autoComplete="new-password"
            InputLabelProps={{ shrink: true }}
            placeholder="Digite sua senha"
            sx={{
              mb: 3,
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
          <TextField
            label="Confirme sua senha"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            InputLabelProps={{ shrink: true }}
            placeholder="Confirme sua senha"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? (
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
              "Cadastrar"
            )}
          </Button>
          <Typography
            variant="body2"
            color="black"
            textAlign="center"
            sx={{ width: "100%", maxWidth: 512 }}
          >
            Já possui uma conta?{" "}
            <Button
              size="small"
              onClick={onSwitchToLogin}
              sx={{
                textTransform: "none",
                color: "#e57373",
                fontWeight: 500,
                minWidth: "auto",
                p: 0,
                ml: 0,
              }}
            >
              Faça login
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
