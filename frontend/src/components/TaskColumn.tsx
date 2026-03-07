import { useState } from "react";
import { Box, Typography, Paper, Avatar, useMediaQuery } from "@mui/material";
import { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";
import emptyColumn from "../images/empty-column.svg";

interface Props {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDuplicate: (task: Task) => void;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
}

const columnConfig: Record<
  TaskStatus,
  { bg: string; titleColor: string; badgeBg: string }
> = {
  [TaskStatus.TODO]: {
    bg: "#EAEAEA",
    titleColor: "#000000",
    badgeBg: "#9e9e9e",
  },
  [TaskStatus.IN_PROGRESS]: {
    bg: "#E3F2FD",
    titleColor: "#039BE5",
    badgeBg: "#039BE5",
  },
  [TaskStatus.DONE]: {
    bg: "#ECFDF3",
    titleColor: "#12B76A",
    badgeBg: "#12B76A",
  },
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onDelete,
  onDuplicate,
  onDrop,
}: Props) {
  const filtered = tasks.filter((t) => t.status === status);
  const [dragOver, setDragOver] = useState(false);
  const config = columnConfig[status];
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: isMobile ? "100%" : 300,
        p: 2,
        backgroundColor: config.bg,
        borderRadius: 3,
        border: dragOver ? "2px dashed black" : "2px solid transparent",
        transition: "border 0.2s, background-color 0.2s",
        ...(dragOver && { backgroundColor: `${config.bg}dd` }),
        minHeight: 200,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight={500}
          sx={{ color: config.titleColor }}
        >
          {title}
        </Typography>
        <Avatar
          sx={{
            width: 26,
            height: 26,
            bgcolor: "#CED6D6",
            color: "#000000",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {filtered.length}
        </Avatar>
      </Box>
      <Box>
        {filtered.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box
              component="img"
              src={emptyColumn}
              alt=""
              sx={{ width: 81, height: 125, opacity: 0.6 }}
            />
          </Box>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}
