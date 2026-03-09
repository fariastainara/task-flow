import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Divider,
  Chip,
  useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Task, TaskStatus, TaskPriority } from "../types";
import { AccessTimeOutlined, TimelapseOutlined } from "@mui/icons-material";

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === TaskStatus.DONE) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + "T00:00:00");
  return due < today;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string; bgColor: string }
> = {
  [TaskPriority.LOW]: {
    label: "Baixa",
    color: "#027A48",
    bgColor: "#ECFDF3",
  },
  [TaskPriority.MEDIUM]: {
    label: "Média",
    color: "#B54708",
    bgColor: "#FFFAEB",
  },
  [TaskPriority.HIGH]: {
    label: "Alta",
    color: "#B42318",
    bgColor: "#FEF3F2",
  },
  [TaskPriority.URGENT]: {
    label: "Urgente",
    color: "#ffffff",
    bgColor: "#B42318",
  },
};

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
}

const statusIcon: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.TODO]: (
    <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: "action.active" }} />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <TimelapseOutlined sx={{ fontSize: 18, color: "action.active" }} />
  ),
  [TaskStatus.DONE]: (
    <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#66bb6a" }} />
  ),
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onDuplicate,
}: Props) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        mb: 1.5,
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 3 },
        borderRadius: 2,
        "& .card-actions": {
          opacity: isMobile ? 1 : 0,
          transition: "opacity 0.2s",
        },
        "&:hover .card-actions": { opacity: 1 },
      }}
      elevation={0}
      variant="outlined"
      draggable
      onDragStart={handleDragStart}
    >
      <CardContent sx={{ pb: "12px !important", pt: 1.5, px: 2 }}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Box sx={{ display: "flex", alignItems: "center", height: 26 }}>
            {statusIcon[task.status]}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: isHovered ? 1 : 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {task.title}
              </Typography>
              <Box
                className="card-actions"
                sx={{
                  display: "flex",
                  ml: isHovered ? 1 : 0,
                  width: isHovered ? "auto" : 0,
                  overflow: "hidden",
                  transition: "width 0.2s",
                }}
              >
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => onEdit(task)}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicar">
                  <IconButton size="small" onClick={() => onDuplicate(task)}>
                    <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(task.id)}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.3 }}
              >
                {task.description}
              </Typography>
            )}
            <Box display="flex" gap={0.5} mt={0.5}>
              <Chip
                label={priorityConfig[task.priority].label}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: priorityConfig[task.priority].bgColor,
                  color: priorityConfig[task.priority].color,
                }}
              />
            </Box>
          </Box>
        </Box>
        {(task.assigneeName ||
          task.dueDate ||
          task.status === TaskStatus.TODO) && (
          <>
            <Divider sx={{ my: 1.5, mx: -2 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {task.assigneeName ? (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PersonOutlineIcon
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {task.assigneeName}
                  </Typography>
                </Box>
              ) : (
                <Box />
              )}
              {task.status === TaskStatus.TODO ? (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTimeOutlined
                    sx={{ fontSize: 16, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Não iniciada
                  </Typography>
                </Box>
              ) : task.status === TaskStatus.DONE ? (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 16, color: "#12B76A" }}
                  />
                  <Typography variant="caption" color="#12B76A">
                    {formatDate(
                      new Date(task.updatedAt).toLocaleDateString("en-CA"),
                    )}
                  </Typography>
                </Box>
              ) : task.dueDate ? (
                <Box display="flex" alignItems="center" gap={1}>
                  {isOverdue(task) && (
                    <Chip
                      label="Atrasada"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: "#FDECEA",
                        color: "#d32f2f",
                      }}
                    />
                  )}
                  <AccessTimeOutlined
                    sx={{
                      fontSize: 16,
                      color: isOverdue(task) ? "#d32f2f" : "text.secondary",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={isOverdue(task) ? "#d32f2f" : "text.secondary"}
                  >
                    {formatDate(task.dueDate)}
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
