import { Request, Response } from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { nome, email, password } = req.body;

  const hash = await bcrypt.hash(password, 8);

  try {
    const user = await prisma.user.create({
      data: { nome, email, password: hash },
    });

    res.json(user);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(400).json({ error: "Erro no cadastro" });
    }

    console.error("Register error:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Senha inválida" });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.json({ token, nome: user.nome, email: user.email });
};