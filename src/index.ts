import express from "express";
import userRoutes from "./modules/auth/auth.routes";
import eventRoutes from "./modules/event/event.routes";
import marketplaceRoutes from "./modules/marketplace/marketplace.routes";
import { errorHandler } from "./middleware/errorHandler";

import {
  helmetConfig, 
  corsConfig,
  apiRateLimiter,
  hppProtection,
} from "./middleware/security";

const app = express();

app.set('trust proxy', 1);
const PORT = process.env.PORT || 8000;

app.use(corsConfig);
app.use(helmetConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(hppProtection); 

// Home route
app.get("/", apiRateLimiter, (_req, res) => {
  res.json({
    message: "Welcome to CampusConnect endpoints!",
  });
});

// API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);

// Register global error handler (needs to be last)
app.use(errorHandler);

// Export app for testing
export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`
      API Server is running on http://localhost:${PORT}
      Sec Middleware: Helmet, CORS, Rate Limiting, HPP
      `);
  });
}

