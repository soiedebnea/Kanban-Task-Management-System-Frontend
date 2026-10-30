import React from 'react';

function deadlineInfo(deadline, done) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Math.round((new Date(d).setHours(0, 0, 0, 0) - today) / 86400000);
  const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (done) return { label, tone: '' };
  if (days < 0) return { label: `${label} · overdue`, tone: 'late' };
  if (days === 0) return { label: 'Due today', tone: 'soon' };
  if (days <= 2) return { label: `${label} · ${days}d left`, tone: 'soon' };
  return { label, tone: '' };
}

export default function TaskCard({ task, onEdit, onDropBefore }) {
  const info = deadlineInfo(task.deadline, task.status === 'done');

  return (
    <article
      className={`card prio-${task.priority}`}
      draggable
      tabIndex={0}
      onDragStart={e => { e.dataTransfer.setData('text/plain', task._id); e.dataTransfer.effectAllowed = 'move'; }}
      onDragOver={e => e.preventDefault()}
      onDrop={onDropBefore}
      onClick={onEdit}
      onKeyDown={e => e.key === 'Enter' && onEdit()}
    >
      <h3>{task.title}</h3>
      {task.description && <p>{task.description}</p>}
      <div className="meta">
        <span className="prio">{task.priority}</span>
        {info && <span className={`due ${info.tone}`}>{info.label}</span>}
      </div>
    </article>
  );
}