export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "StudyTrack API",
    version: "1.0.0",
    description: "Documentação Swagger para o API StudyTrack",
    contact: {
      name: "Fabyola da Silva Campos",
      email: "fabyolacampos.dev@gmail.com",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT ?? 3000}`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Fabyola Campos" },
          email: { type: "string", example: "usuario@example.com" },
          password: { type: "string", example: "$2a$08$abc123..." },
        },
      },
      TokenResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOi..." },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensagem de erro" },
        },
      },
      Meta: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          materia: { type: "string", example: "Matemática" },
          horasMeta: { type: "integer", example: 10 },
          userId: { type: "integer", example: 1 },
        },
      },
      MetaInput: {
        type: "object",
        required: ["materia", "horasMeta"],
        properties: {
          materia: { type: "string", example: "Matemática" },
          horasMeta: { type: "integer", example: 20 },
        },
      },
      Estudo: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          descricao: { type: "string", example: "Revisar álgebra" },
          horas: { type: "integer", example: 2 },
          data: { type: "string", format: "date-time", example: "2026-03-28T12:00:00Z" },
          userId: { type: "integer", example: 1 },
          metaId: { type: "integer", example: 1 },
          meta: { $ref: "#/components/schemas/Meta" },
        },
      },
      EstudoInput: {
        type: "object",
        required: ["horas", "metaId"],
        properties: {
          descricao: { type: "string", example: "Revisar álgebra" },
          horas: { type: "integer", example: 2 },
          metaId: { type: "integer", example: 1 },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/": {
      get: {
        summary: "Informações iniciais da API",
        responses: {
          "200": {
            description: "Informação geral sobre a API",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    api: { type: "string", example: "StudyTrack API" },
                    version: { type: "string", example: "1.0.0" },
                    description: { type: "string", example: "API para gerenciamento de metas e estudos" },
                    author: { type: "string", example: "Seu Nome" },
                    contact: { type: "string", example: "seu.email@example.com" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/register": {
      post: {
        summary: "Registrar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "password"],
                properties: {
                  nome: { type: "string", example: "Fabyola Campos" },
                  email: { type: "string", example: "usuario@example.com" },
                  password: { type: "string", example: "senha123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Usuário registrado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          "400": {
            description: "Erro ao registrar usuário",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/login": {
      post: {
        summary: "Autenticar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "usuario@example.com" },
                  password: { type: "string", example: "senha123" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Token JWT gerado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenResponse" },
              },
            },
          },
          "400": {
            description: "Erro de autenticação",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/metas": {
      get: {
        summary: "Listar metas do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de metas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Meta" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Criar nova meta",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MetaInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Meta criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Meta" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/metas/{id}": {
      get: {
        summary: "Buscar meta por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Meta encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Meta" },
              },
            },
          },
          "404": {
            description: "Meta não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualizar meta",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  materia: { type: "string", example: "Biologia" },
                  horasMeta: { type: "integer", example: 15 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Meta atualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Meta" },
              },
            },
          },
          "404": {
            description: "Meta não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Excluir meta",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Meta excluída com sucesso",
          },
          "400": {
            description: "Não é possível excluir meta com estudos associados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Meta não encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/estudos": {
      get: {
        summary: "Listar estudos do usuário",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de estudos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Estudo" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Criar novo estudo",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EstudoInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Estudo criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Estudo" },
              },
            },
          },
          "400": {
            description: "Dados inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/estudos/{id}": {
      get: {
        summary: "Buscar estudo por ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Estudo encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Estudo" },
              },
            },
          },
          "404": {
            description: "Estudo não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        summary: "Atualizar estudo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  descricao: { type: "string", example: "Revisar álgebra" },
                  horas: { type: "integer", example: 3 },
                  metaId: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Estudo atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Estudo" },
              },
            },
          },
          "404": {
            description: "Estudo ou meta não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Excluir estudo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": {
            description: "Estudo excluído com sucesso",
          },
          "404": {
            description: "Estudo não encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
