import { Box } from "@mui/material";
import { Task, TaskStatus } from "../types";
import TaskColumn from "./TaskColumn";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
}

const columns: { title: string; status: TaskStatus }[] = [
  { title: "Não iniciado", status: TaskStatus.TODO },
  { title: "Em andamento", status: TaskStatus.IN_PROGRESS },
  { title: "Concluído", status: TaskStatus.DONE },
];

export default function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onDuplicate,
  onDrop,
}: Props) {
  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {columns.map((col) => (
        <TaskColumn
          key={col.status}
          title={col.title}
          status={col.status}
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onDrop={onDrop}
        />
      ))}
    </Box>
  );
}
