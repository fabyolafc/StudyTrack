import { Response } from "express";
import { prisma } from "../prisma";
import { AuthRequest } from "../middleware/auth";

export const createEstudo = async (req: AuthRequest, res: Response) => {
  const { descricao, horas, metaId } = req.body;

  if (horas == null || !Number.isInteger(Number(horas)) || metaId == null) {
    return res.status(400).json({ error: "Campos horas e metaId são obrigatórios" });
  }

  const meta = await prisma.meta.findFirst({
    where: { id: Number(metaId), userId: req.user!.id }
  });

  if (!meta) {
    return res.status(404).json({ error: "Meta não encontrada para o usuário" });
  }

  const estudo = await prisma.estudo.create({
    data: {
      descricao,
      horas: Number(horas),
      metaId: Number(metaId),
      userId: req.user!.id
    }
  });

  res.json(estudo);
};

export const getEstudos = async (req: AuthRequest, res: Response) => {
  const estudos = await prisma.estudo.findMany({
    where: { userId: req.user!.id },
    include: { meta: true }
  });

  res.json(estudos);
};

export const getEstudoById = async (req: AuthRequest, res: Response) => {
  const estudoId = Number(req.params.id);

  if (!Number.isInteger(estudoId)) {
    return res.status(400).json({ error: "ID de estudo inválido" });
  }

  const estudo = await prisma.estudo.findFirst({
    where: { id: estudoId, userId: req.user!.id },
    include: { meta: true }
  });

  if (!estudo) {
    return res.status(404).json({ error: "Estudo não encontrado" });
  }

  res.json(estudo);
};

export const updateEstudo = async (req: AuthRequest, res: Response) => {
  const estudoId = Number(req.params.id);
  const { descricao, horas, metaId } = req.body;

  if (!Number.isInteger(estudoId)) {
    return res.status(400).json({ error: "ID de estudo inválido" });
  }

  const existingEstudo = await prisma.estudo.findFirst({
    where: { id: estudoId, userId: req.user!.id }
  });

  if (!existingEstudo) {
    return res.status(404).json({ error: "Estudo não encontrado" });
  }

  let metaToUse = existingEstudo.metaId;

  if (metaId != null) {
    const meta = await prisma.meta.findFirst({
      where: { id: Number(metaId), userId: req.user!.id }
    });

    if (!meta) {
      return res.status(404).json({ error: "Meta não encontrada para o usuário" });
    }

    metaToUse = Number(metaId);
  }

  const updatedEstudo = await prisma.estudo.update({
    where: { id: estudoId },
    data: {
      descricao: descricao ?? existingEstudo.descricao,
      horas: horas != null ? Number(horas) : existingEstudo.horas,
      metaId: metaToUse
    }
  });

  res.json(updatedEstudo);
};

export const deleteEstudo = async (req: AuthRequest, res: Response) => {
  const estudoId = Number(req.params.id);

  if (!Number.isInteger(estudoId)) {
    return res.status(400).json({ error: "ID de estudo inválido" });
  }

  const estudo = await prisma.estudo.findFirst({
    where: { id: estudoId, userId: req.user!.id }
  });

  if (!estudo) {
    return res.status(404).json({ error: "Estudo não encontrado" });
  }

  await prisma.estudo.delete({
    where: { id: estudoId }
  });

  res.status(204).send();
};