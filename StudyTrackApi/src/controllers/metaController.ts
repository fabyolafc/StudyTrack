import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth";

export const createMeta = async (req: AuthRequest, res: Response) => {
  const { materia, horasMeta } = req.body;

  if (!materia || horasMeta == null) {
    return res.status(400).json({ error: "Campos materia e horasMeta são obrigatórios" });
  }

  const meta = await prisma.meta.create({
    data: {
      materia,
      horasMeta,
      userId: req.user!.id
    }
  });

  res.json(meta);
};

export const getMetas = async (req: AuthRequest, res: Response) => {
  const metas = await prisma.meta.findMany({
    where: { userId: req.user!.id }
  });

  res.json(metas);
};

export const getMetaById = async (req: AuthRequest, res: Response) => {
  const metaId = Number(req.params.id);

  if (!Number.isInteger(metaId)) {
    return res.status(400).json({ error: "ID de meta inválido" });
  }

  const meta = await prisma.meta.findFirst({
    where: { id: metaId, userId: req.user!.id }
  });

  if (!meta) {
    return res.status(404).json({ error: "Meta não encontrada" });
  }

  res.json(meta);
};

export const updateMeta = async (req: AuthRequest, res: Response) => {
  const metaId = Number(req.params.id);
  const { materia, horasMeta } = req.body;

  if (!Number.isInteger(metaId)) {
    return res.status(400).json({ error: "ID de meta inválido" });
  }

  const existingMeta = await prisma.meta.findFirst({
    where: { id: metaId, userId: req.user!.id }
  });

  if (!existingMeta) {
    return res.status(404).json({ error: "Meta não encontrada" });
  }

  const updatedMeta = await prisma.meta.update({
    where: { id: metaId },
    data: {
      materia: materia ?? existingMeta.materia,
      horasMeta: horasMeta ?? existingMeta.horasMeta
    }
  });

  res.json(updatedMeta);
};

export const deleteMeta = async (req: AuthRequest, res: Response) => {
  const metaId = Number(req.params.id);

  if (!Number.isInteger(metaId)) {
    return res.status(400).json({ error: "ID de meta inválido" });
  }

  const meta = await prisma.meta.findFirst({
    where: { id: metaId, userId: req.user!.id }
  });

  if (!meta) {
    return res.status(404).json({ error: "Meta não encontrada" });
  }

  const linkedEstudos = await prisma.estudo.count({
    where: { metaId: metaId }
  });

  if (linkedEstudos > 0) {
    return res.status(400).json({ error: "Não é possível excluir uma meta com estudos associados" });
  }

  await prisma.meta.delete({
    where: { id: metaId }
  });

  res.status(204).send();
};