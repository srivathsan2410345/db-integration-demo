import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.set("trust proxy", 1); // Render sits behind a proxy (needed for rate limit)

app.use(
  cors({
    origin(origin, cb) {
      // allow no-origin (curl/health checks) and configured frontend(s)
      if (!origin || config.frontendUrls.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => res.send("OK"));
app.use("/api", messageRoutes);
app.use(errorHandler);

app.listen(config.port, () => console.log(`Backend on port ${config.port}`));
