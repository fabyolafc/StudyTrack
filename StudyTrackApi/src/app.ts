import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import swaggerDocument from "./swagger";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Bem-vindo à StudyTrack API",
    version: "1.0.0",
    description: "API para gerenciamento de metas de estudo e controle de progresso",
    
    author: {
      name: "Fabyola da Silva Campos",
      email: "fabyolacampos.dev@gmail.com"
    },

    endpoints: {
      documentation: "/api-docs",
      auth: {
        register: "POST /register",
        login: "POST /login"
      },
      metas: {
        create: "POST /metas",
        list: "GET /metas",
        update: "PUT /metas/:id",
        delete: "DELETE /metas/:id"
      },
      estudos: {
        create: "POST /estudos",
        list: "GET /estudos",
        update: "PUT /estudos/:id",
        delete: "DELETE /estudos/:id"
      }
    }
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);

export default app;