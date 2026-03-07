import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { Task, TaskStatus, UpdateTaskPayload, BoardMember } from "../types";

interface Props {
  open: boolean;
  task: Task | null;
  members: BoardMember[];
  onClose: () => void;
  onSubmit: (id: string, data: UpdateTaskPayload) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "A Fazer",
  [TaskStatus.IN_PROGRESS]: "Em Progresso",
  [TaskStatus.DONE]: "Concluída",
};

export default function TaskEditDialog({
  open,
  task,
  members,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const handleOpen = () => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setStartDate(task.startDate ?? "");
      setDueDate(task.dueDate ?? "");
      setAssigneeId(task.assigneeId ?? "");
    }
  };

  const handleSubmit = () => {
    if (!task || !title.trim()) return;
    const assignee = members.find((m) => m.userId === assigneeId);
    onSubmit(task.id, {
      title: title.trim(),
      description: description.trim(),
      status,
      assigneeId: assigneeId || undefined,
      assigneeName: assigneeId ? assignee?.name : undefined,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      TransitionProps={{ onEnter: handleOpen }}
    >
      <DialogTitle>Editar Tarefa</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {Object.values(TaskStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {statusLabels[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Responsável</InputLabel>
          <Select
            value={assigneeId}
            label="Responsável"
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <MenuItem value="">
              <em>Nenhum</em>
            </MenuItem>
            {members.map((m) => (
              <MenuItem key={m.userId} value={m.userId}>
                {m.name} ({m.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" gap={2} mt={1}>
          <TextField
            margin="dense"
            label="Data de Início"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Conclusão Prevista"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
