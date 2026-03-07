import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface Props {
  open: boolean;
  boardName: string;
  members: { userId: string; name: string; email: string; avatar?: string }[];
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

export default function BoardMembersDialog({
  open,
  boardName,
  onClose,
  onInvite,
}: Props) {
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddEmail = () => {
    const email = inviteInput.trim();
    if (
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      !inviteEmails.includes(email)
    ) {
      setInviteEmails([...inviteEmails, email]);
      setInviteInput("");
    }
  };

  const handleInvite = async () => {
    if (inviteEmails.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      for (const email of inviteEmails) {
        await onInvite(email);
      }
      setInviteEmails([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao convidar membro");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInviteInput("");
    setInviteEmails([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth disableScrollLock>
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
        Membros
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Você pode adicionar apenas pessoas já cadastradas na plataforma.
        </Alert>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Convidar membros para o quadro "{boardName}":
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            autoFocus
            size="small"
            placeholder="Digite o e-mail do membro"
            fullWidth
            value={inviteInput}
            onChange={(e) => {
              setInviteInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddEmail();
              }
            }}
            error={!!error}
            disabled={loading}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddEmail}
            disabled={!inviteInput.trim()}
            sx={{
              color: "black",
              borderColor: "#ccc",
              textTransform: "none",
              fontWeight: 500,
              minWidth: 80,
              "&:hover": { borderColor: "#999", bgcolor: "transparent" },
            }}
          >
            Adicionar
          </Button>
        </Box>
        {inviteEmails.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {inviteEmails.map((email) => (
              <Chip
                key={email}
                label={email}
                size="small"
                onDelete={() =>
                  setInviteEmails(inviteEmails.filter((e) => e !== email))
                }
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} alignItems="center" px={2} py={1}>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleClose}
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
            variant="contained"
            size="medium"
            onClick={handleInvite}
            disabled={inviteEmails.length === 0 || loading}
            sx={{
              bgcolor: "black",
              textTransform: "none",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Convidar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
