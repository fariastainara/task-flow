import { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  TextField,
  Button,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import AddIcon from "@mui/icons-material/AddOutlined";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRightOutlined";
import emptyState from "../images/empty-state.svg";
import { Board } from "../types";
import { Close } from "@mui/icons-material";

const ICON_OPTIONS: { name: string; icon: React.ReactNode }[] = [
  { name: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { name: "Work", icon: <WorkOutlineIcon fontSize="small" /> },
  { name: "School", icon: <SchoolOutlinedIcon fontSize="small" /> },
  { name: "Fitness", icon: <FitnessCenterOutlinedIcon fontSize="small" /> },
  { name: "Home", icon: <HomeOutlinedIcon fontSize="small" /> },
  { name: "Code", icon: <CodeOutlinedIcon fontSize="small" /> },
  { name: "Star", icon: <StarOutlinedIcon fontSize="small" /> },
  { name: "Favorite", icon: <FavoriteOutlinedIcon fontSize="small" /> },
  { name: "Rocket", icon: <RocketLaunchOutlinedIcon fontSize="small" /> },
  { name: "Lightbulb", icon: <LightbulbOutlinedIcon fontSize="small" /> },
  { name: "Campaign", icon: <CampaignOutlinedIcon fontSize="small" /> },
  { name: "Shopping", icon: <ShoppingCartOutlinedIcon fontSize="small" /> },
  { name: "Brush", icon: <BrushOutlinedIcon fontSize="small" /> },
  { name: "Music", icon: <MusicNoteOutlinedIcon fontSize="small" /> },
  { name: "Travel", icon: <FlightOutlinedIcon fontSize="small" /> },
  { name: "Food", icon: <RestaurantOutlinedIcon fontSize="small" /> },
  { name: "Pets", icon: <PetsOutlinedIcon fontSize="small" /> },
  { name: "Camera", icon: <CameraAltOutlinedIcon fontSize="small" /> },
  { name: "Games", icon: <SportsEsportsOutlinedIcon fontSize="small" /> },
  { name: "Coffee", icon: <LocalCafeOutlinedIcon fontSize="small" /> },
  { name: "Books", icon: <AutoStoriesOutlinedIcon fontSize="small" /> },
  { name: "Palette", icon: <PaletteOutlinedIcon fontSize="small" /> },
  { name: "Savings", icon: <SavingsOutlinedIcon fontSize="small" /> },
  {
    name: "Volunteer",
    icon: <VolunteerActivismOutlinedIcon fontSize="small" />,
  },
  { name: "Trophy", icon: <EmojiEventsOutlinedIcon fontSize="small" /> },
  { name: "Build", icon: <BuildOutlinedIcon fontSize="small" /> },
  { name: "Health", icon: <LocalHospitalOutlinedIcon fontSize="small" /> },
  { name: "Car", icon: <DirectionsCarOutlinedIcon fontSize="small" /> },
  { name: "Movie", icon: <MovieOutlinedIcon fontSize="small" /> },
  { name: "Sports", icon: <SportsBasketballOutlinedIcon fontSize="small" /> },
  { name: "Headphones", icon: <HeadphonesOutlinedIcon fontSize="small" /> },
  { name: "World", icon: <PublicOutlinedIcon fontSize="small" /> },
  { name: "Sun", icon: <WbSunnyOutlinedIcon fontSize="small" /> },
];

function getBoardIcon(iconName?: string, iconColor?: string) {
  const found = ICON_OPTIONS.find((o) => o.name === iconName);
  const icon = found ? found.icon : <DashboardIcon fontSize="small" />;
  if (iconColor) {
    return <Box sx={{ color: iconColor, display: "flex" }}>{icon}</Box>;
  }
  return icon;
}

const COLOR_OPTIONS = [
  "#1976d2",
  "#000000",
  "#616161",
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#4CAF50",
  "#8BC34A",
  "#FF9800",
  "#FF5722",
];

interface Props {
  boards: Board[];
  selectedBoardId: string | null;
  onSelect: (boardId: string) => void;
  onCreate: (
    name: string,
    icon?: string,
    iconColor?: string,
    emails?: string[],
  ) => Promise<void> | void;
  onRename: (
    id: string,
    name: string,
    icon?: string,
    iconColor?: string,
  ) => Promise<void> | void;
  onDelete: (id: string) => void;
  onOpenMembers: (boardId: string) => void;
  onLogout: () => void;
  requestCreateOpen?: boolean;
  onRequestCreateClose?: () => void;
  loadingBoards?: boolean;
}

export default function BoardSelector({
  boards,
  selectedBoardId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
  onLogout,
  requestCreateOpen,
  onRequestCreateClose,
  loadingBoards,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (!loadingBoards && boards.length === 0) {
      setCollapsed(true);
    }
  }, [loadingBoards, boards.length]);

  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("Dashboard");
  const [newIconColor, setNewIconColor] = useState("#1976d2");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestCreateOpen) {
      setCreateOpen(true);
      onRequestCreateClose?.();
    }
  }, [requestCreateOpen, onRequestCreateClose]);

  const handleCreate = async () => {
    if (!newName.trim() || loading) return;
    setLoading(true);
    try {
      if (editingBoardId) {
        await onRename(editingBoardId, newName.trim(), newIcon, newIconColor);
      } else {
        await onCreate(
          newName.trim(),
          newIcon,
          newIconColor,
          inviteEmails.length > 0 ? inviteEmails : undefined,
        );
      }
      closeDialog();
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setCreateOpen(false);
    setEditingBoardId(null);
    setNewName("");
    setNewIcon("Dashboard");
    setNewIconColor("#1976d2");
    setInviteEmails([]);
    setInviteInput("");
  };

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

  const openEdit = (board: Board) => {
    setEditingBoardId(board.id);
    setNewName(board.name);
    setNewIcon(board.icon || "Dashboard");
    setNewIconColor(board.iconColor || "#1976d2");
    setInviteEmails([]);
    setInviteInput("");
    setCreateOpen(true);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: collapsed ? 60 : 260,
        minWidth: collapsed ? 60 : 260,
        borderRight: "1px solid #e0e0e0",
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <Typography variant="subtitle1" fontWeight="bold">
            Quadros
          </Typography>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {!collapsed && (
            <Tooltip title="Novo quadro">
              <IconButton size="small" onClick={() => setCreateOpen(true)}>
                <AddIcon sx={{ color: "text.primary" }} />
              </IconButton>
            </Tooltip>
          )}
          {!isMobile && (
            <Tooltip title={collapsed ? "Expandir" : "Recolher"}>
              <IconButton size="small" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? (
                  <ChevronRightIcon sx={{ color: "text.primary" }} />
                ) : (
                  <ChevronLeftIcon sx={{ color: "text.primary" }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", px: collapsed ? 0.5 : 1 }}>
        {loadingBoards && !collapsed && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <CircularProgress size={28} sx={{ color: "black" }} />
          </Box>
        )}
        {!loadingBoards && boards.length === 0 && !collapsed && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Box
              component="img"
              src={emptyState}
              alt=""
              sx={{ width: 140, height: 140, mb: 0 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: -4 }}>
              Nenhum quadro criado
            </Typography>
          </Box>
        )}
        {boards.map((board) => (
          <ListItemButton
            key={board.id}
            selected={board.id === selectedBoardId}
            onClick={() => onSelect(board.id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              "& .board-actions": {
                opacity: 0,
                transition: "opacity 0.2s",
                position: "absolute",
                right: 8,
              },
              "&:hover .board-actions": { opacity: 1 },
              "&.Mui-selected": {
                bgcolor: "#1976d214",
                color: "#1976d2",
                "&:hover": { bgcolor: "#1976d21F" },
                "& .MuiListItemIcon-root": { color: "#1976d2" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 24,
                justifyContent: "flex-start",
                ml: -0.5,
              }}
            >
              {getBoardIcon(board.icon, board.iconColor)}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={board.name}
                primaryTypographyProps={{
                  noWrap: true,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                }}
                sx={{ ml: 0.5 }}
              />
            )}
            {!collapsed && (
              <Box className="board-actions" sx={{ display: "flex" }}>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(board);
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(board.id);
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </ListItemButton>
        ))}
      </List>

      {/* Dialog criar quadro */}
      <Dialog
        open={createOpen}
        onClose={closeDialog}
        fullWidth
        disableScrollLock
      >
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
          {editingBoardId ? "Editar quadro" : "Novo quadro"}
          <IconButton onClick={closeDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Nome do quadro"
            placeholder="Digite um nome para o quadro"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Typography
            variant="subtitle1"
            sx={{ mt: 3, mb: 2, fontWeight: 600 }}
          >
            Escolha um ícone:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {ICON_OPTIONS.map((option) => (
              <IconButton
                key={option.name}
                onClick={() => setNewIcon(option.name)}
                sx={{
                  border:
                    newIcon === option.name
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                  bgcolor:
                    newIcon === option.name ? "#1976d214" : "transparent",
                  color: newIcon === option.name ? "#1976d2" : undefined,
                }}
              >
                {option.icon}
              </IconButton>
            ))}
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ mt: 3, mb: 2, fontWeight: 600 }}
          >
            Cor do ícone:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {COLOR_OPTIONS.map((color) => (
              <Box
                key={color}
                onClick={() => setNewIconColor(color)}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: color,
                  cursor: "pointer",
                  border:
                    newIconColor === color
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                  outline:
                    newIconColor === color ? "2px solid #1976d2" : "none",
                  outlineOffset: 1,
                  "&:hover": { opacity: 0.8 },
                }}
              />
            ))}
          </Box>
          {!editingBoardId && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ mt: 3, mb: 2, fontWeight: 600 }}
              >
                Convidar membros:{" "}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  (opcional)
                </Typography>
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  placeholder="Digite o e-mail do membro"
                  fullWidth
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
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
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1} alignItems="center" px={2} py={1}>
            <Button
              variant="outlined"
              size="medium"
              onClick={closeDialog}
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
              onClick={handleCreate}
              disabled={!newName.trim() || loading}
              sx={{
                bgcolor: "black",
                textTransform: "none",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : editingBoardId ? (
                "Salvar"
              ) : (
                "Criar"
              )}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          p: collapsed ? 1 : 2,
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {collapsed ? (
          <Tooltip title="Sair">
            <IconButton
              onClick={onLogout}
              sx={{
                color: "text.secondary",
                "&:hover": { bgcolor: "#1976d214", color: "#1976d2" },
              }}
            >
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            fullWidth
            startIcon={<LogoutOutlinedIcon />}
            onClick={onLogout}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 500,
              justifyContent: "flex-start",
              "&:hover": { bgcolor: "#1976d214", color: "#1976d2" },
            }}
          >
            Sair
          </Button>
        )}
      </Box>
    </Paper>
  );
}
