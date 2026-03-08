import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import clientModel from "./client.model";
import createHttpError from "http-errors";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

const creatClient = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = sanitizeBody(req.body);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Validate the name field
  if (!name || typeof name !== "string" || name.trim() === "") {
    return next(
      createHttpError(
        400,
        "The 'name' field is required and must be a non-empty string.",
      ),
    );
  }

  if (!files?.clientLogo?.[0]) {
    return next(createHttpError(400, "A client logo file is required."));
  }

  const file = files.clientLogo[0];
  const filePath = path.resolve(
    __dirname,
    "../../public/uploads/clients",
    file.filename,
  );
  const mimeExt = file.mimetype.split("/").at(-1);

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: file.filename,
      folder: "cp-clients",
      format: mimeExt,
    });

    const newClient = await clientModel.create({
      name,
      clientLogo: uploadResult.secure_url,
      // cloudinaryPublicId: uploadResult.public_id, // ← store for future deletion
    });

    res.status(201).json({
      id: newClient._id,
      message: "Client created successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading files"));
  } finally {
    await unlinkSafe(filePath); // Delete the local file after uploading to Cloudinary
  }
};

// ─────────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────────

const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await clientModel.find();
    res.status(200).json({
      data: clients,
      message: "Clients retrieved successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Error while retrieving clients"));
  }
};

// ─────────────────────────────────────────────
// GET SINGLE CLIENT
// ─────────────────────────────────────────────

const getSingleClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clientId = req.params.clientId;
  try {
    const client = await clientModel.findOne({ _id: clientId });
    if (!client) {
      return next(createHttpError(404, "Client not found"));
    }
    return res.status(200).json({
      data: client,
      message: "Client retrieved successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while retrieving client"));
  }
};

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = sanitizeBody(req.body);
  const clientId = req.params.clientId;

  if (!name || typeof name !== "string") {
    return next(
      createHttpError(
        400,
        "The 'name' field is required and must be a non-empty string.",
      ),
    );
  }

  const client = await clientModel.findOne({ _id: clientId });
  if (!client) {
    return next(createHttpError(404, "Client not found"));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const newFile = files?.clientLogo?.[0];
  const filePath = newFile
    ? path.resolve(__dirname, "../../public/uploads/clients", newFile.filename)
    : null;

  try {
    let newSecureUrl: string | undefined;
    if (newFile && filePath) {
      const mimeExt = newFile.mimetype.split("/").at(-1);
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: newFile.filename,
        folder: "cp-clients",
        format: mimeExt,
      });
      newSecureUrl = uploadResult.secure_url;
    }

    const updatePayload: Record<string, unknown> = { name };

    if (newSecureUrl) updatePayload.clientLogo = newSecureUrl;

    const updatedClient = await clientModel.findByIdAndUpdate(
      clientId,
      updatePayload,
      { new: true, runValidators: true },
    );

    console.log(updatedClient, "hshhshs");

    res.status(200).json({
      data: updatedClient,
      message: "Client updated successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while updating client"));
  }
};

export { creatClient, getClients, getSingleClient, updateClient };
