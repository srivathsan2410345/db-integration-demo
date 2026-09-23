import { prisma } from "../db/prisma.js";

let persistence = true;

export const getPersistence = () => persistence;
export const setPersistence = (value) => (persistence = value);

export async function listMessages() {
  if (!persistence) {
    return [];
  }

  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function createMessage(text) {
  if (!persistence) {
    return {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
    };
  }

  return prisma.message.create({
    data: { text },
  });
}