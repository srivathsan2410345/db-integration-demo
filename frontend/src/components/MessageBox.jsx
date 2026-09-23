import { useState } from "react";

export default function MessageBox({ onSend, sending }) {
  const [text, setText] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const ok = await onSend(text);
    if (ok) setText("");
  }

  return (
    <form className="box" onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        maxLength={200}
        enterKeyHint="send"
      />
      <button type="submit" disabled={sending}>{sending ? "..." : "SEND"}</button>
    </form>
  );
}
