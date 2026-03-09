import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BoardInvitation } from "../types";

interface Props {
  open: boolean;
  invites: BoardInvitation[];
  respondingInviteId: string | null;
  onClose: () => void;
  onRespond: (boardId: string, accept: boolean) => Promise<void>;
}

export default function PendingInvitesDialog({
  open,
  invites,
  respondingInviteId,
  onClose,
  onRespond,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth disableScrollLock>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 2,
        }}
      >
        Convites pendentes
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {invites.length === 0 ? (
          <Alert severity="info">Nenhum convite pendente no momento.</Alert>
        ) : (
          <List disablePadding>
            {invites.map((invite, index) => (
              <ListItem
                key={invite.boardId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  mb: index < invites.length - 1 ? 1.5 : 0,
                }}
              >
                <ListItemText
                  primary={invite.boardName}
                  secondary={
                    invite.inviterName
                      ? `Criado por ${invite.inviterName}`
                      : ""
                  }
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 15 }}
                  secondaryTypographyProps={{ fontSize: 13 }}
                />
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={respondingInviteId === invite.boardId}
                    onClick={() => onRespond(invite.boardId, false)}
                    sx={{
                      color: "black",
                      borderColor: "#ccc",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#999",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    {respondingInviteId === invite.boardId ? (
                      <CircularProgress size={16} sx={{ color: "black" }} />
                    ) : (
                      "Recusar"
                    )}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={respondingInviteId === invite.boardId}
                    onClick={() => onRespond(invite.boardId, true)}
                    sx={{
                      bgcolor: "black",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    {respondingInviteId === invite.boardId ? (
                      <CircularProgress size={16} sx={{ color: "white" }} />
                    ) : (
                      "Aceitar"
                    )}
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={1} alignItems="center" px={2} py={1}>
          <Button
            variant="outlined"
            size="medium"
            onClick={onClose}
            sx={{
              color: "black",
              borderColor: "#ccc",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": { borderColor: "#999", bgcolor: "transparent" },
            }}
          >
            Fechar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
