import { useState, useEffect } from "react";
import {
  Drawer,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  CreateTaskPayload,
  UpdateTaskPayload,
  Task,
  TaskStatus,
  TaskPriority,
  BoardMember,
} from "../types";
import { useAuth } from "../contexts/AuthContext";

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "Não iniciado",
  [TaskStatus.IN_PROGRESS]: "Em andamento",
  [TaskStatus.DONE]: "Concluído",
};

const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "Baixa",
  [TaskPriority.MEDIUM]: "Média",
  [TaskPriority.HIGH]: "Alta",
  [TaskPriority.URGENT]: "Urgente",
};

interface Props {
  open: boolean;
  boardId: string;
  members: BoardMember[];
  task?: Task | null;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => void;
  onUpdate?: (id: string, data: UpdateTaskPayload) => void;
}

export default function TaskForm({
  open,
  boardId,
  members,
  task,
  onClose,
  onSubmit,
  onUpdate,
}: Props) {
  const { user } = useAuth();
  const isEditMode = !!task;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState(user?.id || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setStartDate(task.startDate ?? "");
      setDueDate(task.dueDate ?? "");
      setAssigneeId(task.assigneeId ?? "");
    } else if (open && !task && user?.id) {
      setAssigneeId(user.id);
    }
  }, [open, task, user?.id]);

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setStatus(TaskStatus.TODO);
    setPriority(TaskPriority.MEDIUM);
    setStartDate("");
    setDueDate("");
    setAssigneeId(user?.id || "");
  };

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;
    const assignee = members.find((m) => m.userId === assigneeId);
    setLoading(true);
    try {
      if (isEditMode && onUpdate) {
        await onUpdate(task.id, {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          assigneeId: assigneeId || undefined,
          assigneeName: assigneeId ? assignee?.name : undefined,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        });
      } else {
        await onSubmit({
          boardId,
          title: title.trim(),
          description: description.trim(),
          priority,
          assigneeId: assigneeId || undefined,
          assigneeName: assignee?.name,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        });
      }
      resetFields();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "40%",
        },
      }}
    >
      <Stack
        bgcolor="grey.50"
        px={isMobile ? 2 : 4}
        pt={isMobile ? 2 : 4}
        pb={2}
        height="100%"
      >
        {/* Header */}
        <Box display="flex" flexDirection="column" gap={4} pb={4}>
          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">
              {isEditMode ? "Editar tarefa" : "Nova tarefa"}
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Content */}
        <Box flex={1} overflow="auto">
          <Box
            bgcolor="background.paper"
            borderRadius={2}
            border="1px solid"
            borderColor="grey.300"
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <TextField
              autoFocus
              label="Nome da tarefa"
              placeholder="Ex: Definir requisitos do documento"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <FormControl fullWidth>
              <InputLabel shrink>Responsável</InputLabel>
              <Select
                value={assigneeId}
                label="Responsável"
                displayEmpty
                onChange={(e) => setAssigneeId(e.target.value)}
                notched
              >
                {members.map((m) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel shrink>Prioridade</InputLabel>
              <Select
                value={priority}
                label="Prioridade"
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                notched
              >
                {Object.values(TaskPriority).map((p) => (
                  <MenuItem key={p} value={p}>
                    {priorityLabels[p]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isEditMode && (
              <FormControl fullWidth>
                <InputLabel shrink>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  notched
                >
                  {Object.values(TaskStatus).map((s) => (
                    <MenuItem key={s} value={s}>
                      {statusLabels[s]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Descrição (opcional)"
              placeholder="Descreva os detalhes da tarefa"
              InputLabelProps={{ shrink: true }}
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Data planejada de início:"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Data planejada de conclusão:"
              type="date"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Stack
          py={2}
          px={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          borderTop="1px solid"
          borderColor="divider"
        >
          <Button
            variant="text"
            size="medium"
            onClick={handleClose}
            sx={{
              color: "black",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="medium"
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
            sx={{
              bgcolor: "black",
              textTransform: "none",
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : isEditMode ? (
              "Salvar"
            ) : (
              "Criar"
            )}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
