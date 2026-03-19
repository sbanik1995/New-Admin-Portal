// Entry point of the Admin Portal server.
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

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
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin_portal';
const publicDir = path.join(__dirname, 'public');

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
