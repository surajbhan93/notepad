require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const { authenticate } = require('./middleware/auth');
const { searchNotes } = require('./controllers/notesController');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const openApiSpec = require('./utils/openapi');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Rate Limiting ──────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ── Logging & Parsing ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger 
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
// ── Routes ─────────────────────────────────────────────────────────
app.use('/', authRoutes);
app.use('/notes', notesRoutes);
app.get('/search', authenticate, searchNotes);

// ── Meta Routes ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/openapi.json', (req, res) => {
  res.status(200).json(openApiSpec);
});

app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Notes App API',
    email: 'dev@notesapp.com',
    version: '1.0.0',
    my_features: {
      'Note Tagging System': {
        description:
          'Users can add multiple tags to notes for easy categorization and filtering. Tags are indexed and filterable via the GET /notes?tag=work endpoint.',
        why: 'Tags solve real user pain: finding the right note fast. Unlike full-text search which requires knowing content, tags let users pre-organize by project, priority, or context.',
      },
      'Note Colors & Pinning': {
        description:
          'Notes can have custom hex colors and be pinned to the top of the list. Pinned notes always appear first.',
        why: 'Visual hierarchy helps users quickly scan and prioritize. This mirrors Google Keep UX which has proven effective for note-taking apps.',
      },
      'Permission-based Sharing': {
        description:
          'When sharing, owners choose "read" or "edit" permission. Read-only users can view but not modify notes.',
        why: 'Simple all-or-nothing sharing causes over-sharing. Granular permissions reduce accidental edits and enable safer collaboration.',
      },
      'Note Archiving': {
        description:
          'Notes can be archived instead of deleted. Archived notes are hidden by default but accessible via GET /notes?archived=true.',
        why: 'Users often want to keep old notes without cluttering the main view. Archiving is a safer, recoverable alternative to deletion.',
      },
      'Full-text Search': {
        description:
          'GET /search?q=keyword uses MongoDB text indexes to search across title, content, and tags with relevance scoring.',
        why: 'As note count grows, manual browsing fails. Text search with relevance ranking is the most scalable UX for retrieval.',
      },
      Pagination: {
        description:
          'All list endpoints support page & limit params with total count and hasNextPage metadata.',
        why: 'Returning all notes at once fails at scale. Pagination keeps responses fast and enables infinite scroll on the frontend.',
      },
    },
  });
});

// ── Error Handling ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────────────
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Notes API running on port ${PORT}`);
    console.log(`📖 Swagger Docs: http://localhost:${PORT}/docs`);
console.log(`📄 OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
  });
};

startServer().catch(console.error);

module.exports = app;
