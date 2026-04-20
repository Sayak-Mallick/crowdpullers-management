import mongoose from "mongoose";
import { Events } from "./events.types";

/**
 * Events Schema
 *
 * Optimised with:
 * - Compound index on { year, month } for fast date-range aggregations
 *   (e.g. "all events in 2026-Q1") — covers queries that filter by year alone too.
 * - Index on `category` for filtered listings and group-by aggregations.
 * - Index on `organization` for org-scoped lookups.
 * - `lean()` compatible — no virtuals needed, keeping responses lightweight.
 * - `timestamps` enabled for audit / sort-by-latest use-cases.
 */
const eventsSchema = new mongoose.Schema<Events>(
  {
    /** Display title of the event */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Rich-text or plain description shown on the event detail page */
    description: {
      type: String,
      required: true,
      trim: true,
    },

    /** Calendar year the event takes place (e.g. 2026) */
    year: {
      type: Number,
      required: true,
      index: true, // standalone index for year-only filters
    },

    /** 1-indexed calendar month (1 = Jan … 12 = Dec) */
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    /** Venue / city name */
    location: {
      type: String,
      required: true,
      trim: true,
    },

    /** Name of the organising body */
    organization: {
      type: String,
      required: true,
      trim: true,
      index: true, // fast org-scoped queries
    },

    /** Event type tag — e.g. "conference", "workshop", "fest" */
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // enables efficient $group / $match by category
    },

    /** Cloudinary / S3 URL of the event banner image */
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ── Compound index ──────────────────────────────────────────────
 * Covers the most common aggregation pipeline:
 *   { $match: { year, month } }  →  { $group: { _id: "$category" } }
 *
 * Mongo can use the left-prefix (year) for year-only queries too,
 * so a separate single-field year index is only kept as a fallback
 * for sort-heavy queries where the planner prefers it.
 */
eventsSchema.index({ year: 1, month: 1 });

/**
 * ── Text index ──────────────────────────────────────────────────
 * Allows $text searches across title, description & location
 * for a lightweight server-side search without a dedicated engine.
 */
eventsSchema.index(
  { title: "text", description: "text", location: "text" },
  { weights: { title: 10, location: 5, description: 1 } }
);

export default mongoose.model<Events>("Event", eventsSchema);
