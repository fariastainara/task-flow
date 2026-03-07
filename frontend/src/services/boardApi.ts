import {
  Board,
  BoardMember,
  CreateBoardPayload,
  UpdateBoardPayload,
} from "../types";

function normalizeUrl(url: string): string {
  if (url && !/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

const API_URL = `${normalizeUrl(import.meta.env.VITE_API_URL || "http://localhost:3000")}/boards`;

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

export const boardApi = {
  getAll: async (userId?: string): Promise<Board[]> => {
    const url = userId
      ? `${API_URL}?userId=${encodeURIComponent(userId)}`
      : API_URL;
    const res = await fetch(url);
    return handleResponse<Board[]>(res);
  },

  getById: async (id: string): Promise<Board> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
    return handleResponse<Board>(res);
  },

  create: async (data: CreateBoardPayload): Promise<Board> => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Board>(res);
  },

  update: async (id: string, data: UpdateBoardPayload): Promise<Board> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<Board>(res);
  },

  remove: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return handleResponse<void>(res);
  },

  getMembers: async (boardId: string): Promise<BoardMember[]> => {
    const res = await fetch(
      `${API_URL}/${encodeURIComponent(boardId)}/members`,
    );
    return handleResponse<BoardMember[]>(res);
  },

  inviteMember: async (
    boardId: string,
    email: string,
  ): Promise<BoardMember> => {
    const res = await fetch(
      `${API_URL}/${encodeURIComponent(boardId)}/members`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    return handleResponse<BoardMember>(res);
  },

  removeMember: async (boardId: string, userId: string): Promise<void> => {
    const res = await fetch(
      `${API_URL}/${encodeURIComponent(boardId)}/members/${encodeURIComponent(userId)}`,
      {
        method: "DELETE",
      },
    );
    return handleResponse<void>(res);
  },
};
