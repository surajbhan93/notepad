const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Notes App API',
    version: '1.0.0',
    description: 'Multi-user notes management REST API with sharing and search capabilities.',
    contact: { name: 'Notes App', email: 'admin@notesapp.com' },
  },
  servers: [{ url: process.env.API_BASE_URL || 'http://localhost:5000', description: 'API Server' }],
  components: {
    securitySchemes: {
      BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          color: { type: 'string' },
          isPinned: { type: 'boolean' },
          isArchived: { type: 'boolean' },
          owner: { $ref: '#/components/schemas/User' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get JWT token',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { access_token: { type: 'string' } },
                },
              },
            },
          },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        responses: { 200: { description: 'User profile' } },
      },
      put: {
        tags: ['Auth'],
        summary: 'Update current user profile',
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/notes': {
      get: {
        tags: ['Notes'],
        summary: 'Get all notes (owned + shared)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'archived', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { 200: { description: 'List of notes with pagination' } },
      },
      post: {
        tags: ['Notes'],
        summary: 'Create a new note',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  color: { type: 'string' },
                  isPinned: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Note created' } },
      },
    },
    '/notes/{id}': {
      get: {
        tags: ['Notes'],
        summary: 'Get note by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Note data' }, 404: { description: 'Not found' } },
      },
      put: {
        tags: ['Notes'],
        summary: 'Update a note',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Updated note' } },
      },
      delete: {
        tags: ['Notes'],
        summary: 'Delete a note',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/notes/{id}/share': {
      post: {
        tags: ['Notes'],
        summary: 'Share note with another user',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['share_with_email'],
                properties: {
                  share_with_email: { type: 'string', format: 'email' },
                  permission: { type: 'string', enum: ['read', 'edit'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Note shared successfully' } },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Full-text search notes',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Search results' } },
      },
    },
    '/about': {
      get: {
        tags: ['Meta'],
        summary: 'About this API',
        security: [],
        responses: { 200: { description: 'App metadata and features' } },
      },
    },
    '/openapi.json': {
      get: {
        tags: ['Meta'],
        summary: 'Get OpenAPI specification',
        security: [],
        responses: { 200: { description: 'OpenAPI 3.0 JSON spec' } },
      },
    },
    '/health': {
      get: {
        tags: ['Meta'],
        summary: 'Health check',
        security: [],
        responses: { 200: { description: 'Server status' } },
      },
    },
  },
};

module.exports = openApiSpec;
