# Admin Portal (Node.js + Express + MongoDB + Vanilla JS)

A complete full-stack admin portal to manage daily office operations.

## Features

- Session-based admin login/logout
- Dashboard cards (total tasks, attendance status, pending bugs, upcoming meetings)
- Attendance management with monthly history
- Leave management (Sick/Casual/Personal + status)
- Meeting manager
- Daily task list (create/update/delete)
- Test report upload (PDF/DOC/DOCX)
- Project document upload/download
- Bug reporting with severity/status and screenshot upload
- Responsive dashboard UI with sidebar

## Project Structure

```text
.
├── controllers/
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── js/
│   ├── dashboard.html
│   └── index.html
├── routes/
├── uploads/
│   ├── bugs/
│   ├── documents/
│   └── reports/
├── .env.example
├── package.json
└── server.js
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Ensure MongoDB is running locally or update `MONGO_URI`.
4. Start server:
   ```bash
   npm start
   ```
5. Open:
   - Login page: `http://localhost:3000`
   - Dashboard: `http://localhost:3000/dashboard.html`

## Default Credentials

- Username: `admin`
- Password: `admin123`

> Change credentials in `.env` for production use.

## Preview URL Notes

If your hosted preview serves the repository root as static content, use:

- `/` -> redirects to `/public/index.html`
- `/preview` -> redirects to `/public/dashboard.html`

This avoids `Not Found` pages in preview environments that do not run `server.js`.
