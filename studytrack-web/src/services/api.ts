import type { AuthResponse, Estudo, Meta } from "../types";

type LocalUser = {
  id: number;
  nome: string;
  email: string;
  password: string;
  token: string;
};

const API_URL = "https://studytrackapi.onrender.com";
const LOCAL_USERS_KEY = "studytrack_local_users";

const getToken = () => localStorage.getItem("token")?.trim() ?? "";

const loadLocalUsers = (): LocalUser[] => {
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as LocalUser[];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: LocalUser[]) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const createLocalUser = (
  nome: string,
  email: string,
  password: string
): LocalUser => {
  const users = loadLocalUsers();
  const normalized = email.toLowerCase();
  const exists = users.some((user) => user.email.toLowerCase() === normalized);

  if (exists) {
    throw new Error("Email já existe");
  }

  const newUser: LocalUser = {
    id: Date.now(),
    nome,
    email: normalized,
    password,
    token: `local-${Math.random().toString(36).slice(2)}-${Date.now()}`,
  };

  saveLocalUsers([...users, newUser]);
  return newUser;
};

const loginLocalUser = (email: string, password: string): AuthResponse => {
  const users = loadLocalUsers();
  const normalized = email.toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalized);

  if (!user || user.password !== password) {
    throw new Error("Usuário não encontrado");
  }

  return { token: user.token, nome: user.nome, email: user.email };
};

// ================= AUTH =================

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
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
  } catch {
    return loginLocalUser(email, password);
  }
}

export async function register(
  nome: string,
  email: string,
  password: string
): Promise<{ id: number }> {
  try {
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
  } catch {
    const localUser = createLocalUser(nome, email, password);
    return { id: localUser.id };
  }
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

const LOCAL_METAS_KEY = "studytrack_local_metas";
const LOCAL_ESTUDOS_KEY = "studytrack_local_estudos";

type LocalMeta = Meta & { id: number; userId: number };
type LocalEstudo = Estudo & { id: number; userId: number };

const loadLocalStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const saveLocalStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const requireLocalUser = (token: string) => {
  const users = loadLocalUsers();
  const user = users.find((item) => item.token === token);
  if (!user) throw new Error("Token inválido");
  return user;
};

const getLocalItemsForUser = <T extends { userId: number }>(
  key: string,
  token: string,
): T[] => {
  const user = requireLocalUser(token);
  return loadLocalStorage<T[]>(key, []).filter((item) => item.userId === user.id);
};

const addLocalItemForUser = <T extends { userId?: number }>(
  key: string,
  token: string,
  item: Omit<T, "id" | "userId">,
): T & { id: number; userId: number } => {
  const user = requireLocalUser(token);
  const items = loadLocalStorage<(T & { id: number; userId: number })[]>(key, []);
  const newItem = {
    ...item,
    id: Date.now(),
    userId: user.id,
  } as T & { id: number; userId: number };

  saveLocalStorage(key, [...items, newItem]);
  return newItem;
};

const deleteLocalItemForUser = (
  key: string,
  token: string,
  id: number,
) => {
  const user = requireLocalUser(token);
  const items = loadLocalStorage<(LocalMeta | LocalEstudo)[]>(key, []).filter(
    (item) => !(item.userId === user.id && item.id === id),
  );
  saveLocalStorage(key, items);
};

const updateLocalItemForUser = <T extends { userId: number; id: number }>(
  key: string,
  token: string,
  id: number,
  data: Partial<Omit<T, "id" | "userId">>,
): T => {
  const user = requireLocalUser(token);
  const items = loadLocalStorage<T[]>(key, []);
  const nextItems = items.map((item) =>
    item.userId === user.id && item.id === id ? { ...item, ...data } : item,
  );
  saveLocalStorage(key, nextItems);
  const updated = nextItems.find((item) => item.userId === user.id && item.id === id);
  if (!updated) throw new Error("Item não encontrado");
  return updated;
};

// ================= METAS =================

export const getMetas = async (): Promise<Meta[]> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/metas`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Erro ao buscar metas");

    return res.json();
  } catch {
    return getLocalItemsForUser<LocalMeta>(LOCAL_METAS_KEY, token).map(
      ({ id, materia, horasMeta }) => ({ id, materia, horasMeta }),
    );
  }
};

export const createMeta = async (data: {
  materia: string;
  horasMeta: number;
}): Promise<Meta> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/metas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao criar meta");

    return res.json();
  } catch {
    return addLocalItemForUser<LocalMeta>(LOCAL_METAS_KEY, token, data);
  }
};

export const updateMeta = async (
  id: number,
  data: { materia: string; horasMeta: number }
): Promise<Meta> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/metas/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar meta");

    return res.json();
  } catch {
    return updateLocalItemForUser<LocalMeta>(LOCAL_METAS_KEY, token, id, data);
  }
};

export const deleteMeta = async (id: number): Promise<void> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/metas/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Erro ao deletar meta");
  } catch {
    deleteLocalItemForUser(LOCAL_METAS_KEY, token, id);
  }
};

// ================= ESTUDOS =================

export const getEstudos = async (): Promise<Estudo[]> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/estudos`, {
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Erro ao buscar estudos");

    return res.json();
  } catch {
    return getLocalItemsForUser<LocalEstudo>(LOCAL_ESTUDOS_KEY, token).map(
      ({ id, descricao, horas, metaId, data }) => ({ id, descricao, horas, metaId, data }),
    );
  }
};

export const createEstudo = async (data: {
  descricao?: string;
  horas: number;
  metaId: number;
}): Promise<Estudo> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/estudos`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao criar estudo");

    return res.json();
  } catch {
    return addLocalItemForUser<LocalEstudo>(LOCAL_ESTUDOS_KEY, token, {
      ...data,
      data: new Date().toISOString(),
    });
  }
};

export const updateEstudo = async (
  id: number,
  data: {
    descricao?: string;
    horas: number;
    metaId: number;
  }
): Promise<Estudo> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/estudos/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar estudo");

    return res.json();
  } catch {
    return updateLocalItemForUser<LocalEstudo>(LOCAL_ESTUDOS_KEY, token, id, data);
  }
};

export const deleteEstudo = async (id: number): Promise<void> => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/estudos/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Erro ao deletar estudo");
  } catch {
    deleteLocalItemForUser(LOCAL_ESTUDOS_KEY, token, id);
  }
};