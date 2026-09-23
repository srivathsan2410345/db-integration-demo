import * as service from "../services/messageService.js";
import { messageSchema, settingsSchema } from "../schemas/messageSchema.js";

export async function getMessages(req, res, next) {
  try {
    res.json(await service.listMessages());
  } catch (err) {
    next(err);
  }
}

export async function postMessage(req, res, next) {
  try {
    const parsed = messageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    res.status(201).json(await service.createMessage(parsed.data.text));
  } catch (err) {
    next(err);
  }
}

export function getSettings(req, res) {
  res.json({ persistence: service.getPersistence() });
}

export function updateSettings(req, res) {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid settings." });
  res.json({ persistence: service.setPersistence(parsed.data.persistence) });
}
