import { useEffect, useState, useCallback } from "react";
import * as api from "./services/api.js";
import MessageBox from "./components/MessageBox.jsx";
import MessageList from "./components/MessageList.jsx";
import Toggle from "./components/Toggle.jsx";

const TITLE = "Database Integration Demo"; // change me

export default function App() {
  const [messages, setMessages] = useState([]);
  const [persistence, setPersistence] = useState(true);
  const [uiGood, setUiGood] = useState(true); // local, presentation only
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [temporaryMessages, setTemporaryMessages] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const [msgs, settings] = await Promise.all([
        api.getMessages(),
        api.getSettings(),
      ]);

      setMessages(msgs);
      setPersistence(settings.persistence);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 2500); // polling
    return () => clearInterval(id);
  }, [refresh]);

  async function handleSend(text) {
    setSending(true);

    try {
      const message = await api.sendMessage(text);

      if (persistence) {
        // It was saved to Neon.
        // Refresh so it becomes part of persistent history.
        await refresh();
      } else {
        // It was NOT saved.
        // Keep it only in this browser's current React state.
        setTemporaryMessages((prev) => [message, ...prev]);
      }

      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setSending(false);
    }
  }

  async function togglePersistence() {
    try {
      const s = await api.setPersistence(!persistence);
      setPersistence(s.persistence);
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className={uiGood ? "app good" : "app bad"}>
      <main className="wrap">
        <h1>{TITLE}</h1>

        <div className="toggles">
          <Toggle label="Persistence" on={persistence} onLabel="ON" offLabel="OFF" onClick={togglePersistence} />
          <Toggle label="UI Mode" on={uiGood} onLabel="GOOD" offLabel="BAD" onClick={() => setUiGood(!uiGood)} />
        </div>

        <h2>Send something</h2>
        <MessageBox onSend={handleSend} sending={sending} />
        {error && <p className="error">{error}</p>}

        <h2>Messages</h2>
        <MessageList
          messages={[...temporaryMessages, ...messages]}
        />
      </main>
    </div>
  );
}
