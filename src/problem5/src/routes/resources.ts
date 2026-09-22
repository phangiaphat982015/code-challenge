import { Router } from "express";
import { z } from "zod";
import { Op } from "sequelize";
import { Resource } from "../models/resource";

export const resourcesRouter = Router();

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
});

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field is required",
  });

const listQuerySchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(1).optional(),
});

resourcesRouter.get("/", async (req, res, next) => {
  try {
    const query = listQuerySchema.parse(req.query);

    const where: Record<string, unknown> = {};

    if (query.id !== undefined) {
      where.id = query.id;
    }

    if (query.name !== undefined) {
      where.name = {
        [Op.iLike]: `%${query.name}%`,
      };
    }

    const rows = await Resource.findAll({
      where,
      order: [["id", "ASC"]],
    });

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

resourcesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const row = await Resource.findByPk(id);

    if (!row) {
      return res.status(404).json({ error: "not found" });
    }

    res.json(row);
  } catch (error) {
    next(error);
  }
});

resourcesRouter.post("/", async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const row = await Resource.create({ name: input.name });

    res.status(201).json(row);
  } catch (error) {
    next(error);
  }
});

resourcesRouter.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const input = patchSchema.parse(req.body);
    const row = await Resource.findByPk(id);

    if (!row) {
      return res.status(404).json({ error: "not found" });
    }

    await row.update(input);
    res.json(row);
  } catch (error) {
    next(error);
  }
});

resourcesRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "invalid id" });
    }

    const row = await Resource.findByPk(id);

    if (!row) {
      return res.status(404).json({ error: "not found" });
    }

    await row.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
