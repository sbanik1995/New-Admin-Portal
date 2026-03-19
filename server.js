// Entry point of the Admin Portal server.
const fs = require('fs');
const path = require('path');
const http = require('http');

// Load environment variables only when dotenv is available.
try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv is not installed. Falling back to process environment variables.');
}

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin_portal';
const publicDir = path.join(__dirname, 'public');

/**
 * Minimal fallback static server used when project dependencies are unavailable.
 * This keeps local "Preview" tabs functional in constrained environments.
 */
function startFallbackPreviewServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
  };

  const resolveStaticPath = (requestPath) => {
    if (requestPath === '/' || requestPath === '/login') {
      return path.join(publicDir, 'index.html');
    }

    if (requestPath === '/dashboard' || requestPath === '/preview') {
      return path.join(publicDir, 'dashboard.html');
    }

    const sanitized = requestPath.replace(/\.\./g, '');
    return path.join(publicDir, sanitized);
  };

  const server = http.createServer((req, res) => {
    const requestPath = (req.url || '/').split('?')[0];

    if (requestPath === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ message: 'Fallback preview server is running.' }));
      return;
    }

    if (requestPath.startsWith('/api/')) {
      res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          message:
            'API is unavailable because dependencies are not installed in this environment. Install dependencies to enable backend APIs.',
        })
      );
      return;
    }

    let filePath = resolveStaticPath(requestPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(publicDir, 'index.html');
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Unable to load preview page.');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      });
      res.end(content);
    });
  });

  server.listen(PORT, () => {
    console.log(`Fallback preview server running on http://localhost:${PORT}`);
  });
}

let express;
let mongoose;
let session;

try {
  express = require('express');
  mongoose = require('mongoose');
  session = require('express-session');
} catch (error) {
  console.warn('Core dependencies are missing. Starting fallback preview server.');
  startFallbackPreviewServer();
  return;
}

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const taskRoutes = require('./routes/taskRoutes');
const testReportRoutes = require('./routes/testReportRoutes');
const projectDocumentRoutes = require('./routes/projectDocumentRoutes');
const bugRoutes = require('./routes/bugRoutes');

const app = express();

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(publicDir));

// Session-based authentication (in-memory store for local/dev use).
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
  })
);

// Explicit frontend routes prevent "Not Found" pages in environments
// that open dashboard/preview paths directly (without .html suffix).
app.get(['/', '/login'], (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get(['/dashboard', '/preview'], (req, res) => {
  res.sendFile(path.join(publicDir, 'dashboard.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/test-reports', testReportRoutes);
app.use('/api/project-documents', projectDocumentRoutes);
app.use('/api/bugs', bugRoutes);

// Health endpoint to quickly verify server status.
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Admin portal server is running.' });
});

// API 404 handler keeps unknown API requests explicit.
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found.' });
});

// Frontend fallback: route unknown non-API URLs to login page.
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Generic error handler keeps API failures structured.
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
