import "dotenv/config";

export const config = {
  port: process.env.PORT || 3000,
  // comma-separated list allowed, trailing slashes stripped
  frontendUrls: (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((u) => u.trim().replace(/\/$/, "")),
};
