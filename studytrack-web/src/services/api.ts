import type { AuthResponse, Estudo, Meta } from "../types";

const API_URL = "https://studytrackapi.onrender.com";

const getToken = () => localStorage.getItem("token")?.trim() ?? "";


// ================= AUTH =================

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errorMessage = body?.error ?? "Email ou senha inválidos";
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function register(
  nome: string,
  email: string,
  password: string
): Promise<{ id: number }> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const errorMessage = body?.error ?? "Erro ao cadastrar";
    throw new Error(errorMessage);
  }

  return res.json();
}

// ================= TOKEN =================

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// ================= METAS =================

export const getMetas = async (): Promise<Meta[]> => {
  const res = await fetch(`${API_URL}/metas`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao buscar metas");

  return res.json();
};

export const createMeta = async (data: {
  materia: string;
  horasMeta: number;
}): Promise<Meta> => {
  const res = await fetch(`${API_URL}/metas`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar meta");

  return res.json();
};

export const updateMeta = async (
  id: number,
  data: { materia: string; horasMeta: number }
): Promise<Meta> => {
  const res = await fetch(`${API_URL}/metas/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar meta");

  return res.json();
};

export const deleteMeta = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/metas/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao deletar meta");
};

// ================= ESTUDOS =================

export const getEstudos = async (): Promise<Estudo[]> => {
  const res = await fetch(`${API_URL}/estudos`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao buscar estudos");

  return res.json();
};

export const createEstudo = async (data: {
  descricao?: string;
  horas: number;
  metaId: number;
}): Promise<Estudo> => {
  const res = await fetch(`${API_URL}/estudos`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar estudo");

  return res.json();
};

export const updateEstudo = async (
  id: number,
  data: {
    descricao?: string;
    horas: number;
    metaId: number;
  }
): Promise<Estudo> => {
  const res = await fetch(`${API_URL}/estudos/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao atualizar estudo");

  return res.json();
};

export const deleteEstudo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/estudos/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao deletar estudo");
};