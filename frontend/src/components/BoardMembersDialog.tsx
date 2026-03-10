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
  Avatar,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Close, PersonRemove, CancelOutlined } from "@mui/icons-material";
import { BoardMember } from "../types";

interface Props {
  open: boolean;
  boardName: string;
  members: BoardMember[];
  createdBy?: string;
  currentUserId?: string;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

export default function BoardMembersDialog({
  open,
  boardName,
  members,
  createdBy,
  currentUserId,
  onClose,
  onInvite,
  onRemoveMember,
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
          pr: 2,
        }}
      >
        Membros
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Você só pode adicionar pessoas já cadastradas na plataforma.
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
        {members.length > 0 && (
          <>
            <Divider sx={{ mt: 4, mb: 3 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Membros do quadro ({members.length})
            </Typography>
            <List dense disablePadding>
              {members.map((member) => {
                const isCreator = member.userId === createdBy;
                const isCurrentUser = member.userId === currentUserId;
                const canRemove = currentUserId === createdBy && !isCreator;
                const isPending = member.status === "PENDING";

                return (
                  <ListItem
                    key={member.userId}
                    disableGutters
                    secondaryAction={
                      canRemove ? (
                        <Tooltip
                          title={
                            isCurrentUser
                              ? "Você não pode se remover"
                              : isPending
                                ? "Cancelar convite"
                                : "Remover membro"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              edge="end"
                              color={isPending ? "default" : "error"}
                              disabled={isCurrentUser}
                              onClick={() => {
                                onRemoveMember(member.userId);
                              }}
                              sx={{
                                border: "1px solid #ccc",
                                borderRadius: 1,
                                padding: "4px",
                                width: 28,
                                height: 28,
                                color: isPending ? "black" : undefined,
                                "&:hover": {
                                  bgcolor: isPending
                                    ? "transparent"
                                    : "#ffebee",
                                  borderColor: "#999",
                                },
                                "&.Mui-disabled": {
                                  border: "1px solid #e0e0e0",
                                },
                              }}
                            >
                              {isPending ? (
                                <CancelOutlined fontSize="small" />
                              ) : (
                                <PersonRemove fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : isCreator ? (
                        <Chip
                          label="Administrador"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 11,
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            fontWeight: 600,
                          }}
                        />
                      ) : null
                    }
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        src={member.avatar}
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {!member.avatar &&
                          member.name
                            ?.split(" ")
                            .filter(Boolean)
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography fontSize={14} fontWeight={500}>
                            {member.name}
                          </Typography>
                          {member.status === "PENDING" && (
                            <Chip
                              label="Pendente"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 11,
                                bgcolor: "#fff3e0",
                                color: "#e65100",
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {member.status === "DECLINED" && (
                            <Chip
                              label="Convite recusado"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 11,
                                bgcolor: "#ffebee",
                                color: "#c62828",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={member.email}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
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
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Convidar"
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
