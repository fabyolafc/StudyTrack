export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  nome?: string;
  email?: string;
}

export interface Meta {
  id: number;
  materia: string;
  horasMeta: number;
}

export interface Estudo {
  id: number;
  descricao?: string;
  horas: number;
  metaId: number;
  data: string;
}