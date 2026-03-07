import { useState, useRef, useEffect, FormEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCameraOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Close } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

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
  open: boolean;
  onClose: () => void;
}

export default function EditProfileDialog({ open, onClose }: Props) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
      setError(null);
      setSuccess(false);
    }
  }, [open, user]);

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
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({ name, email, avatar });
      setSuccess(true);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      disableScrollLock
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle
          noWrap
          textOverflow="ellipsis"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 4,
          }}
        >
          Editar perfil
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 1,
              mb: 2,
            }}
          >
            <Box sx={{ position: "relative", mb: 1 }}>
              <Avatar
                src={avatar}
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: avatar ? "transparent" : "white",
                  border: avatar ? "none" : "1px solid black",
                  fontSize: 40,
                  fontWeight: 600,
                  color: "text.secondary",
                }}
              >
                {!avatar && name ? (
                  getInitials(name)
                ) : !avatar ? (
                  <PersonOutlinedIcon sx={{ fontSize: 64 }} />
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
                    width: 32,
                    height: 32,
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {avatar && (
                <Tooltip title="Remover foto">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setAvatar(undefined);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" },
                      width: 24,
                      height: 24,
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
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
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Perfil atualizado com sucesso!
            </Alert>
          )}

          <TextField
            label="Nome"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            autoComplete="name"
          />
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            autoComplete="email"
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1} alignItems="center" px={2} py={1}>
            <Button
              variant="outlined"
              size="medium"
              onClick={onClose}
              disabled={loading}
              sx={{
                color: "black",
                borderColor: "#ccc",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { borderColor: "#999", bgcolor: "transparent" },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              disabled={loading}
              sx={{
                bgcolor: "black",
                textTransform: "none",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Salvar"
              )}
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
