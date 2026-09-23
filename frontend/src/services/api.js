const BASE = import.meta.env.VITE_API_URL;

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Could not connect to the server.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const getMessages = () => request("/api/messages");
export const sendMessage = (text) =>
  request("/api/messages", { method: "POST", body: JSON.stringify({ text }) });
export const getSettings = () => request("/api/settings");
export const setPersistence = (persistence) =>
  request("/api/settings", { method: "POST", body: JSON.stringify({ persistence }) });
