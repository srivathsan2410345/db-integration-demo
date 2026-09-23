import { prisma } from "../db/prisma.js";

let persistence = true;

export const getPersistence = () => persistence;
export const setPersistence = (value) => {
  persistence = value;
  return persistence;
};

export async function listMessages() {
  // ALWAYS return persisted history.
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function createMessage(text) {
  if (persistence) {
    // Persistence ON → save permanently
    return prisma.message.create({
      data: { text },
    });
  }

  // Persistence OFF → return the message,
  // but DO NOT save it to Neon.
  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    createdAt: new Date().toISOString(),
    persistent: false,
  };
}