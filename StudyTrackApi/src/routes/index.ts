import { Router } from "express";
import { register, login } from "../controllers/authController";
import {
  createMeta,
  getMetas,
  getMetaById,
  updateMeta,
  deleteMeta
} from "../controllers/metaController";
import {
  createEstudo,
  getEstudos,
  getEstudoById,
  updateEstudo,
  deleteEstudo
} from "../controllers/estudoController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.use(authMiddleware);

router.post("/metas", createMeta);
router.get("/metas", getMetas);
router.get("/metas/:id", getMetaById);
router.put("/metas/:id", updateMeta);
router.delete("/metas/:id", deleteMeta);

router.post("/estudos", createEstudo);
router.get("/estudos", getEstudos);
router.get("/estudos/:id", getEstudoById);
router.put("/estudos/:id", updateEstudo);
router.delete("/estudos/:id", deleteEstudo);

export default router;