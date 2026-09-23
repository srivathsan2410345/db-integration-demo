export default function MessageList({ messages }) {
  if (messages.length === 0) return <p className="empty">No messages yet.</p>;
  return (
    <ul className="list">
      {messages.map((m) => (
        <li key={m.id}>{m.text}</li>
      ))}
    </ul>
  );
}
