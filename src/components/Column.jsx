import React, { useState } from 'react';
import TaskCard from './TaskCard.jsx';

export default function Column({ column, tasks, onAdd, onEdit, onMove }) {
  const [over, setOver] = useState(false);

  const drop = (e, beforeId = null) => {
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) onMove(id, column.id, beforeId);
  };

  return (
    <section
      className={`column ${over ? 'over' : ''}`}
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }}
      onDrop={e => drop(e)}
    >
      <div className="column-head">
        <h2>{column.label}</h2>
        <span className="count">{tasks.length}</span>
      </div>

      <div className="cards">
        {tasks.map(t => (
          <TaskCard key={t._id} task={t} onEdit={() => onEdit(t)} onDropBefore={e => drop(e, t._id)} />
        ))}
        {tasks.length === 0 && <p className="empty">Drop a task here or add one.</p>}
      </div>

      <button className="btn ghost" onClick={onAdd}>Add task</button>
    </section>
  );
}