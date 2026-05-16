const express = require("express");
const router = express.Router();

// GET /about
router.get("/about", (req, res) => {
  res.status(200).json({
    name: "Surajbhan",
    email: "suraj933628@gmai.com",
    my_features: {
      "Note Pinning": "Users can pin important notes so they always appear at the top of their list. Chosen because it directly solves the pain point of finding important notes quickly.",
      "Note Colors": "Users can assign colors (red, orange, yellow, green, blue, purple) to notes for visual categorization. Chosen because visual differentiation improves organization at a glance.",
      "Permission-based Sharing":
      "Users can share notes with read or edit permissions. Read-only users cannot modify notes. Chosen to provide safer collaboration and prevent accidental edits.",
      "Note Tags": "Users can add multiple tags to notes for flexible categorization and filtering. Chosen because tags provide a non-hierarchical, flexible way to organize notes.",
      "Full-text Search": "Users can search across all their notes (owned + shared) by title and content using MongoDB text indexes. Chosen because search is fundamental to a useful notes app at scale.",
      "Pagination": "GET /notes supports page and limit query params returning total, page, and totalPages metadata. Chosen for performance with large note collections.",
      "Note Unsharing": "Note owners can revoke access from previously shared users via DELETE /notes/:id/share. Chosen to give users full control over their data sharing."
    }
  });
});

// GET /openapi.json
router.get("/openapi.json", (req, res) => {
  const spec = {
    openapi: "3.0.0",
    info: {
      title: "Notes App API",
      version: "1.0.0",
      description: "Backend API for a multi-user notes service",
    },
    servers: [{ url: process.env.API_BASE_URL || "http://localhost:5000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Note: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            isPinned: { type: "boolean" },
            tags: { type: "array", items: { type: "string" } },
            color: { type: "string", enum: ["default", "red", "orange", "yellow", "green", "blue", "purple"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: { message: { type: "string" } },
        },
      },
    },
    paths: {
      "/me": {
  get: {
    summary: "Get current logged-in user",
    tags: ["Auth"],
    security: [{ BearerAuth: [] }],
    responses: {
      200: {
        description: "Current user profile"
      },
      401: {
        description: "Unauthorized"
      }
    }
  }
},
      "/register": {
        post: {
          summary: "Register a new user",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                    name: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Validation error" },
            409: { description: "Email already registered" },
          },
        },
      },
      "/login": {
        post: {
          summary: "Login and get JWT token",
          tags: ["Auth"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { access_token: { type: "string" } },
                  },
                },
              },
            },
            401: { description: "Invalid email or password" },
          },
        },
      },
      "/notes": {
        get: {
          summary: "Get all notes for authenticated user",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
            { name: "tag", in: "query", schema: { type: "string" } },
            { name: "color", in: "query", schema: { type: "string" } },
          ],
          responses: {
            200: { description: "List of notes with pagination" },
            401: { description: "Unauthorized" },
          },
        },
        post: {
          summary: "Create a new note",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "content"],
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                    color: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Note created" },
            400: { description: "Validation error" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/notes/search": {
        get: {
          summary: "Full-text search notes",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Search results" },
            400: { description: "Query required" },
          },
        },
      },
      "/notes/{id}": {
        get: {
          summary: "Get a specific note by ID",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: { description: "Note data" },
            403: { description: "Access denied" },
            404: { description: "Note not found" },
          },
        },
        put: {
          summary: "Update a note",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Updated note" }, 403: { description: "Forbidden" } },
        },
        delete: {
          summary: "Delete a note",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 204: { description: "Deleted" }, 403: { description: "Forbidden" } },
        },
      },
      "/notes/{id}/share": {
        post: {
          summary: "Share a note with another user",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["share_with_email"],
                  properties: { share_with_email: { type: "string", format: "email" } },
                },
              },
            },
          },
          responses: { 200: { description: "Note shared" }, 404: { description: "User not found" } },
        },
        delete: {
          summary: "Unshare a note",
          tags: ["Notes"],
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["unshare_email"],
                  properties: { unshare_email: { type: "string", format: "email" } },
                },
              },
            },
          },
          responses: { 200: { description: "Note unshared" } },
        },
      },
      "/about": {
        get: {
          summary: "About the developer and features",
          tags: ["Meta"],
          responses: { 200: { description: "About info" } },
        },
      },
    },
  };

  res.status(200).json(spec);
});

module.exports = router;
