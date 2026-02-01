export default function SessionList({
  sessions,
  onSelect,
  onNew,
  onDelete,
  activeId,
}) {
  return (
    <div>
      <button onClick={onNew}>New Session</button>

      {sessions.map((s) => (
        <div
          key={s._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            background: activeId === s._id ? "#eee" : "transparent",
            padding: "6px 10px",
          }}
        >
          <div onClick={() => onSelect(s._id)} style={{ cursor: "pointer" }}>
            <div>{s.title}</div>
          </div>

          <button onClick={() => onDelete(s._id)}>🗑</button>
        </div>
      ))}
    </div>
  );
}
