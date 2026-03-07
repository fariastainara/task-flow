import { useState, useEffect, useCallback } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  Button,
  Avatar,
  Box,
  Tooltip,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddOutlined";
import GroupIcon from "@mui/icons-material/GroupOutlined";
import logoHeader from "./images/logo-header.svg";
import backgroundEmptyKanban from "./images/background-empty-kanban.svg";
import backgroundTelaMenor from "./images/backgroung-telas-menores.svg";
import {
  Task,
  Board,
  BoardMember,
  TaskStatus,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "./types";
import { taskApi } from "./services/taskApi";
import { boardApi } from "./services/boardApi";
import TaskBoard from "./components/TaskBoard";
import TaskForm from "./components/TaskForm";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EditProfileDialog from "./components/EditProfileDialog";
import BoardSelector from "./components/BoardSelector";
import BoardMembersDialog from "./components/BoardMembersDialog";
import { useAuth } from "./contexts/AuthContext";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
});

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:1024px)");
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authPage, setAuthPage] = useState<"login" | "register">("login");
  const [profileOpen, setProfileOpen] = useState(false);
  const [requestCreateBoard, setRequestCreateBoard] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(true);

  const loadBoards = useCallback(async () => {
    if (boards.length === 0) {
      setLoadingBoards(true);
    }
    try {
      const data = await boardApi.getAll(user?.id);
      setBoards(data);
      if (data.length > 0 && !selectedBoardId) {
        setSelectedBoardId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar quadros");
    } finally {
      setLoadingBoards(false);
    }
  }, [selectedBoardId, user?.id]);

  const loadTasks = useCallback(async () => {
    if (!selectedBoardId) {
      setTasks([]);
      return;
    }
    try {
      const data = await taskApi.getAll(selectedBoardId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tarefas");
    }
  }, [selectedBoardId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBoards();
    }
  }, [isAuthenticated, loadBoards]);

  const loadMembers = useCallback(async () => {
    if (!selectedBoardId) {
      setMembers([]);
      return;
    }
    try {
      const data = await boardApi.getMembers(selectedBoardId);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar membros");
    }
  }, [selectedBoardId]);

  useEffect(() => {
    if (selectedBoardId) {
      loadTasks();
      loadMembers();
    }
  }, [selectedBoardId, loadTasks, loadMembers]);

  const handleCreateBoard = async (
    name: string,
    icon?: string,
    iconColor?: string,
    emails?: string[],
  ) => {
    try {
      const board = await boardApi.create({
        name,
        icon,
        iconColor,
        userId: user!.id,
      });
      await loadBoards();
      setSelectedBoardId(board.id);
      if (emails && emails.length > 0) {
        for (const email of emails) {
          try {
            await boardApi.inviteMember(board.id, email);
          } catch {
            // ignora erros individuais de convite
          }
        }
      }
      const data = await boardApi.getMembers(board.id);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar quadro");
    }
  };

  const handleRenameBoard = async (
    id: string,
    name: string,
    icon?: string,
    iconColor?: string,
  ) => {
    try {
      await boardApi.update(id, { name, icon, iconColor });
      await loadBoards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao editar quadro");
    }
  };

  const handleDeleteBoard = async (id: string) => {
    try {
      await boardApi.remove(id);
      const remaining = boards.filter((b) => b.id !== id);
      setBoards(remaining);
      if (selectedBoardId === id) {
        setSelectedBoardId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir quadro");
    }
  };

  const handleInviteMember = async (email: string) => {
    if (!selectedBoardId) return;
    await boardApi.inviteMember(selectedBoardId, email);
    await loadMembers();
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedBoardId) return;
    await boardApi.removeMember(selectedBoardId, userId);
    await loadMembers();
  };

  const handleOpenMembers = async (boardId: string) => {
    setSelectedBoardId(boardId);
    try {
      const data = await boardApi.getMembers(boardId);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar membros");
    }
    setMembersOpen(true);
  };

  const handleCreate = async (data: CreateTaskPayload) => {
    try {
      await taskApi.create(data);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tarefa");
    }
  };

  const handleUpdate = async (id: string, data: UpdateTaskPayload) => {
    try {
      await taskApi.update(id, data);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar tarefa");
    }
  };

  const handleDuplicate = async (task: Task) => {
    try {
      await taskApi.create({
        boardId: task.boardId,
        title: `${task.title} (cópia)`,
        description: task.description || undefined,
        assigneeId: task.assigneeId || undefined,
        assigneeName: task.assigneeName || undefined,
        startDate: task.startDate || undefined,
        dueDate: task.dueDate || undefined,
      });
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao duplicar tarefa");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await taskApi.remove(id);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir tarefa");
    }
  };

  const handleDrop = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      await handleUpdate(taskId, { status: newStatus });
    }
  };

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "white",
            px: 4,
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src={logoHeader}
            alt="TaskFlow"
            sx={{ height: 40, mb: 5 }}
          />
          <Typography variant="h5" fontWeight={700} mb={2}>
            Acesse pelo computador
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            maxWidth={360}
            sx={{ position: "relative", zIndex: 1 }}
          >
            O TaskFlow ainda não tem suporte para telas pequenas. Para uma
            melhor experiência, acesse pelo computador.
          </Typography>
          <Box
            component="img"
            src={backgroundTelaMenor}
            alt="Acesse pelo computador"
            sx={{ width: "100%", maxWidth: 360, mt: 4 }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {authPage === "login" ? (
          <LoginPage onSwitchToRegister={() => setAuthPage("register")} />
        ) : (
          <RegisterPage onSwitchToLogin={() => setAuthPage("login")} />
        )}
      </ThemeProvider>
    );
  }

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component="img"
            src={logoHeader}
            alt="taskflow"
            sx={{ width: 178, height: 42 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Editar perfil">
              <Box
                onClick={() => setProfileOpen(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "black",
                    fontWeight: 700,
                    fontSize: 12,
                    mr: 1,
                  }}
                >
                  {user?.name}
                </Typography>
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 28,
                    height: 28,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {!user?.avatar &&
                    user?.name
                      ?.split(" ")
                      .filter(Boolean)
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                </Avatar>
              </Box>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <BoardSelector
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelect={setSelectedBoardId}
          onCreate={handleCreateBoard}
          onRename={handleRenameBoard}
          onDelete={handleDeleteBoard}
          onOpenMembers={handleOpenMembers}
          onLogout={logout}
          requestCreateOpen={requestCreateBoard}
          onRequestCreateClose={() => setRequestCreateBoard(false)}
          loadingBoards={loadingBoards}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            position: "relative",
            bgcolor: selectedBoardId ? undefined : "white",
          }}
        >
          {selectedBoardId ? (
            <Box sx={{ py: 3, px: 3, minHeight: "80vh" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={400} color="text.primary">
                  {boards.find((b) => b.id === selectedBoardId)?.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<GroupIcon />}
                    onClick={() => handleOpenMembers(selectedBoardId)}
                    disableRipple
                    sx={{
                      color: "text.primary",
                      borderColor: "#ccc",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": {
                        borderColor: "#999",
                        bgcolor: "transparent",
                      },
                      "&:active": {
                        boxShadow: "none",
                      },
                    }}
                  >
                    Membros
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    Nova tarefa
                  </Button>
                </Box>
              </Box>
              <TaskBoard
                tasks={tasks}
                onEdit={setEditTask}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onDrop={handleDrop}
              />
            </Box>
          ) : loadingBoards ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 64px)",
                width: "100%",
                bgcolor: "white",
              }}
            >
              <CircularProgress sx={{ color: "black" }} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                height: "calc(100vh - 64px)",
                width: "100%",
                bgcolor: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={backgroundEmptyKanban}
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
                  opacity: 0.6,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: 900,
                  px: 4,
                  ml: 4,
                  mt: -4,
                }}
              >
                <Typography
                  fontWeight={700}
                  fontSize={70}
                  lineHeight={1.1}
                  color="black"
                  mb={2}
                >
                  Organize suas tarefas em um só lugar.
                </Typography>
                <Typography fontSize={24} color="text.secondary" mb={4}>
                  Crie seu primeiro quadro e comece a<br />
                  gerenciar suas atividades.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setRequestCreateBoard(true)}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: 16,
                    px: 4,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  Começar agora
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {selectedBoardId && (
        <TaskForm
          open={createOpen}
          boardId={selectedBoardId}
          members={members}
          onClose={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {selectedBoardId && (
        <TaskForm
          open={!!editTask}
          boardId={selectedBoardId}
          members={members}
          task={editTask}
          onClose={() => setEditTask(null)}
          onSubmit={handleCreate}
          onUpdate={handleUpdate}
        />
      )}

      <EditProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {selectedBoard && (
        <BoardMembersDialog
          open={membersOpen}
          boardName={selectedBoard.name}
          members={members}
          onClose={() => setMembersOpen(false)}
          onInvite={handleInviteMember}
          onRemoveMember={handleRemoveMember}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
