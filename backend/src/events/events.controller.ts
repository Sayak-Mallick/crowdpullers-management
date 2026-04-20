import { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import EventModel from "./events.model";
import { Events, PaginatedResponse } from "./events.types";

const sanitizeBody = (body: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(body).map(([k, v]) => [
      k.trim(),
      typeof v === "string" ? v.trim() : v,
    ])
  );

/** Deletes a local temp file — never throws, just logs. */
const unlinkSafe = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.warn("Could not delete temp file:", filePath, err);
  }
};

/** Default & ceiling values for pagination */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Clamp a numeric query-param to a safe integer within [min, max].
 * Returns `fallback` when the value is missing or non-numeric.
 */
const clampInt = (
  raw: unknown,
  fallback: number,
  min: number,
  max: number
): number => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**
 * GET /events?page=1&limit=10
 *
 * Returns a paginated list of events sorted by newest first.
 * Both `page` and `limit` are optional — sensible defaults apply.
 *
 * Optional filter query-params:
 *   - year     (number)  — filter by event year
 *   - month    (number)  — filter by event month (1-12)
 *   - category (string)  — filter by category
 */
const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = clampInt(req.query.page, DEFAULT_PAGE, 1, Number.MAX_SAFE_INTEGER);
    const limit = clampInt(req.query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
    const skip = (page - 1) * limit;

    // ── Build optional filter ────────────────────────────────────
    const filter: Record<string, unknown> = {};
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.category) filter.category = req.query.category;

    // ── Run query + count in parallel for speed ──────────────────
    const [events, totalDocs] = await Promise.all([
      EventModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EventModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    const response: PaginatedResponse<Events> = {
      data: events as unknown as Events[],
      pagination: {
        page,
        limit,
        totalDocs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(createHttpError(500, "Failed to fetch events"));
  }
};

const getSingleEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent };
