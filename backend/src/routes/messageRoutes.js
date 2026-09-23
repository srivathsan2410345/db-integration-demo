import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as c from "../controllers/messageController.js";

const router = Router();

// Lightweight abuse guard: 20 posts/minute per IP
const postLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  message: { error: "Too many messages. Slow down a little." },
});

router.get("/messages", c.getMessages);
router.post("/messages", postLimiter, c.postMessage);
router.get("/settings", c.getSettings);
router.post("/settings", c.updateSettings);

export default router;
