export function errorHandler(err, req, res, next) {
  console.error(err); // logged on the server only, never sent to the client
  const isDb = err?.name?.startsWith("PrismaClient") || err?.code?.startsWith?.("P");
  if (isDb) {
    return res.status(503).json({ error: "Could not connect to the database." });
  }
  res.status(500).json({ error: "Something went wrong on the server." });
}
