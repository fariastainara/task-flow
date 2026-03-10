export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface BoardMember {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  status?: "PENDING" | "ACCEPTED" | "DECLINED";
}

export interface Board {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  createdBy: string;
  members: BoardMember[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardInvitation {
  boardId: string;
  boardName: string;
  boardIcon: string;
  boardIconColor: string;
  boardBgColor: string;
  invitedAt: string;
  inviterName: string;
}

export interface CreateBoardPayload {
  name: string;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
  userId: string;
}

export interface UpdateBoardPayload {
  name?: string;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  boardId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  dueDate?: string;
}
