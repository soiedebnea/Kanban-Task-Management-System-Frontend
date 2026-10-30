import React, { useState } from 'react';

const toInput = d => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function TaskModal({ task, defaultStatus, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || defaultStatus || 'todo',
    priority: task?.priority || 'medium',
    deadline: toInput(task?.deadline)
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...(task ? { _id: task._id } : {}), ...form, deadline: form.deadline || null });
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={e => e.stopPropagation()}>
        <h2>{task ? 'Edit task' : 'New task'}</h2>

        <label>Title
          <input autoFocus value={form.title} maxLength={120} onChange={e => set('title', e.target.value)} required />
        </label>
        <label>Description
          <textarea rows={3} value={form.description} maxLength={1000} onChange={e => set('description', e.target.value)} />
        </label>

        <div className="row">
          <label>Status
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>
          <label>Priority
            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>Deadline
            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </label>
        </div>

        <div className="actions">
          {task && <button type="button" className="btn danger" onClick={() => onDelete(task._id)}>Delete task</button>}
          <span className="spacer" />
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">{task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}