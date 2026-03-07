export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  startDate?: string;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
