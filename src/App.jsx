import React, { useEffect, useState } from 'react';
import * as api from './api.js';
import Column from './components/Column.jsx';
import TaskModal from './components/TaskModal.jsx';

export const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // { task?, status? }

  useEffect(() => {
    api.getTasks().then(setTasks).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const byColumn = id => tasks.filter(t => t.status === id).sort((a, b) => a.order - b.order);

  async function handleSave(form) {
    try {
      if (form._id) {
        const updated = await api.updateTask(form._id, form);
        setTasks(ts => ts.map(t => (t._id === updated._id ? updated : t)));
      } else {
        const created = await api.createTask(form);
        setTasks(ts => [...ts, created]);
      }
      setModal(null);
    } catch (e) { setError(e.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    try {
      await api.deleteTask(id);
      setTasks(ts => ts.filter(t => t._id !== id));
      setModal(null);
    } catch (e) { setError(e.message); }
  }

  // Drop a task into a column, before `beforeId` (or at the end)
  async function handleMove(taskId, status, beforeId) {
    const moving = tasks.find(t => t._id === taskId);
    if (!moving || taskId === beforeId) return;

    const target = byColumn(status).filter(t => t._id !== taskId);
    const idx = beforeId ? target.findIndex(t => t._id === beforeId) : target.length;
    target.splice(idx < 0 ? target.length : idx, 0, { ...moving, status });

    const source = moving.status === status ? [] : byColumn(moving.status).filter(t => t._id !== taskId);
    const changed = [
      ...target.map((t, i) => ({ ...t, order: i })),
      ...source.map((t, i) => ({ ...t, order: i }))
    ];

    const prev = tasks;
    const map = new Map(changed.map(t => [t._id, t]));
    setTasks(ts => ts.map(t => map.get(t._id) || t));
    try {
      await api.reorderTasks(changed.map(t => ({ id: t._id, status: t.status, order: t.order })));
    } catch (e) {
      setTasks(prev);
      setError(e.message);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Kanban Board</h1>
        <button className="btn primary" onClick={() => setModal({ status: 'todo' })}>New task</button>
      </header>

      {error && (
        <div className="alert" role="alert">
          {error} <button onClick={() => setError('')} aria-label="Dismiss">×</button>
        </div>
      )}

      {loading ? (
        <p className="muted pad">Loading tasks…</p>
      ) : (
        <main className="board">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={byColumn(col.id)}
              onAdd={() => setModal({ status: col.id })}
              onEdit={task => setModal({ task })}
              onMove={handleMove}
            />
          ))}
        </main>
      )}

      {modal && (
        <TaskModal
          task={modal.task}
          defaultStatus={modal.status}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}