import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { env } from "./config/env";
import { apiRateLimit } from "./middleware/rateLimit";
import { errorHandler, notFound } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import accountRoutes from "./routes/account.routes";
import transferRoutes from "./routes/transfer.routes";
import transactionRoutes from "./routes/transaction.routes";
import adminRoutes from "./routes/admin.routes";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(apiRateLimit);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      service: "SecureBank API",
      status: "healthy",
      timestamp: new Date().toISOString()
    }
  });
});

const openApiPath = path.resolve(process.cwd(), "docs", "openapi.json");
if (fs.existsSync(openApiPath)) {
  const openApiDocument = JSON.parse(fs.readFileSync(openApiPath, "utf-8"));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);
