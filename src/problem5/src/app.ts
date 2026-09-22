import dotenv from "dotenv";

dotenv.config();
import express from "express";
import { sequelize } from "./db";
import "./models/resource";
import { resourcesRouter } from "./routes/resources";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/resources", resourcesRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof Error && err.name === "ZodError") {
      return res.status(400).json({ error: "invalid request" });
    }

    if (
      err instanceof SyntaxError &&
      "status" in err &&
      (err as { status?: number }).status === 400
    ) {
      return res.status(400).json({ error: "malformed json" });
    }

    console.error(err);
    return res.status(500).json({ error: "internal error" });
  },
);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start app:", error);
  process.exit(1);
});
