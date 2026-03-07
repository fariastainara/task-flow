import { Task, CreateTaskPayload, UpdateTaskPayload } from "../types";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/tasks`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || `Erro ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export const taskApi = {
  getAll: async (boardId?: string): Promise<Task[]> => {
    const url = boardId
      ? `${API_URL}?boardId=${encodeURIComponent(boardId)}`
      : API_URL;
    const res = await fetch(url);
    return handleResponse<Task[]>(res);
  },

  getById: async (id: string): Promise<Task> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
    return handleResponse<Task>(res);
  },

  create: async (data: CreateTaskPayload): Promise<Task> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  update: async (id: string, data: UpdateTaskPayload): Promise<Task> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  remove: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return handleResponse<void>(res);
  },
};
