# Kanban Frontend

React (Vite) interface for the Kanban task manager. Three columns, **To Do**, **In Progress** and **Done**, with drag & drop, priorities and deadlines.

## File structure

```
kanban-frontend/
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── .env.example            # copy to .env
├── .gitignore
└── src/
    ├── main.jsx            # React entry
    ├── App.jsx             # state, loading, drag & drop logic
    ├── api.js              # fetch wrapper for the backend
    ├── styles.css
    └── components/
        ├── Column.jsx      # one status column (drop target)
        ├── TaskCard.jsx    # draggable card with deadline badge
        └── TaskModal.jsx   # create / edit / delete form
```

## Requirements

- Node.js 18+
- The backend (`kanban-backend`) running, default `http://localhost:5000`

## Setup

```bash
cd kanban-frontend
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## Environment variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

Restart `npm run dev` after changing `.env`.

## Features

- Create, edit and delete tasks (title, description, priority, deadline)
- Drag cards between columns or reorder within a column; positions are saved to MongoDB
- Deadline badges: "Due today", "n d left", "overdue"
- Responsive layout: columns stack on mobile

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank page / `React is not defined` | Use the latest `.jsx` files and `vite.config.js`, then restart |
| Tasks not loading | Check the backend is running and `VITE_API_URL` is correct |
| CORS error | Backend `CLIENT_ORIGIN` must match this app's URL (`http://localhost:5173`) |
| Page blank when opening `index.html` directly | Use `npm run dev` and open `http://localhost:5173` |
