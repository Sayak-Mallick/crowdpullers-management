import { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import eventModel from "./events.model";
import { Events, PaginatedResponse } from "./events.types";

const sanitizeBody = (body: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(body).map(([k, v]) => [
      k.trim(),
      typeof v === "string" ? v.trim() : v,
    ]),
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
  max: number,
): number => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
};

const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, year, month, location, organization, category } =
    sanitizeBody(req.body);

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  // Validate required fields
  if (!title || !description || !location || !organization || !category) {
    return next(createHttpError(400, "All fields are required"));
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isNaN(parsedYear) ||
    Number.isNaN(parsedMonth) ||
    parsedMonth < 1 ||
    parsedMonth > 12
  ) {
    return next(createHttpError(400, "Invalid year or month"));
  }

  const file = files?.eventImage?.[0];

  if (!file) {
    return next(createHttpError(400, "Event image is required"));
  }

  const filePath = path.resolve(
    __dirname,
    "../../public/uploads/events",
    file.filename,
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "cp-events",
      resource_type: "image",
    });

    const newEvent = await eventModel.create({
      title: title as string,
      description: description as string,
      year: parsedYear,
      month: parsedMonth,
      location: location as string,
      organization: organization as string,
      category: category as string,
      eventImage: uploadResult.secure_url,
    });

    return res.status(201).json({
      id: newEvent._id,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return next(createHttpError(500, "Failed to create event"));
  } finally {
    // Safe cleanup
    await unlinkSafe(filePath);
  }
};

const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = clampInt(
      req.query.page,
      DEFAULT_PAGE,
      1,
      Number.MAX_SAFE_INTEGER,
    );
    const limit = clampInt(req.query.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
    const skip = (page - 1) * limit;

    // ── Build optional filter ────────────────────────────────────
    const filter: Record<string, unknown> = {};
    if (req.query.year) filter.year = Number(req.query.year);
    if (req.query.month) filter.month = Number(req.query.month);
    if (req.query.category) filter.category = req.query.category;

    // ── Run query + count in parallel for speed ──────────────────
    const [events, totalDocs] = await Promise.all([
      eventModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      eventModel.countDocuments(filter),
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
  next: NextFunction,
) => {};

const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export { createEvent, getAllEvents, getSingleEvent, updateEvent, deleteEvent };
