import { prisma } from "../db/prisma.js";

let persistence = true;  // GLOBAL toggle (resets to ON on restart)
const memory = [];       // used when persistence is OFF
let nextId = 1;

export const getPersistence = () => persistence;
export const setPersistence = (value) => (persistence = value);

export async function listMessages() {
  if (persistence) {
    return prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  }
  return [...memory].reverse().slice(0, 100);
}

export async function createMessage(text) {
  if (persistence) {
    return prisma.message.create({ data: { text } });
  }
  const msg = { id: nextId++, text, createdAt: new Date().toISOString() };
  memory.push(msg);
  return msg;
}
