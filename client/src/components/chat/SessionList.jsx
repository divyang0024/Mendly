export default function SessionList({ sessions, onSelect, onNew }) {
  return (
    <div style={{ width: 200 }}>
      <button onClick={onNew}>+ New Session</button>
      {sessions.map((s) => (
        <div key={s._id} onClick={() => onSelect(s._id)}>
          Session {new Date(s.startedAt).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
