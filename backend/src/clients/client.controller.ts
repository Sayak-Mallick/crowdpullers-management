import { Request, Response, NextFunction } from "express";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import clientModel from "./client.model";

const sanitizeBody = (body: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(body).map(([k, v]) => [
      k.trim(),
      typeof v === "string" ? v.trim() : v,
    ])
  );

const unlinkSafe = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.warn("Could not delete temp file:", filePath, err);
  }
};

const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = sanitizeBody(req.body);
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!name || typeof name !== "string" || name.trim() === "") {
    return next(
      createHttpError(
        400,
        "The 'name' field is required and must be a non-empty string."
      )
    );
  }

  if (!files?.clientLogo?.[0]) {
    return next(createHttpError(400, "A client logo file is required."));
  }

  const file = files.clientLogo[0];
  const filePath = path.resolve(
    __dirname,
    "../../public/uploads/clients",
    file.filename
  );
  const mimeExt = file.mimetype.split("/").pop();

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: file.filename,
      folder: "cp-clients",
      format: mimeExt,
    });

    const newClient = await clientModel.create({
      name,
      clientLogo: uploadResult.secure_url,
    });

    res.status(201).json({
      id: newClient._id,
      message: "Client created successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while uploading files"));
  } finally {
    await unlinkSafe(filePath);
  }
};

const getAllClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clients = await clientModel
      .find()
      // Only fetch the fields the frontend actually needs — skip __v
      .select("name clientLogo createdAt updatedAt")
      // Returns plain JS objects — no Mongoose document overhead (~2-5x faster)
      .lean()
      .sort({ createdAt: -1 });

    // Cache: browser/CDN may serve this for 60s, stale for 5 min while revalidating
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    res.status(200).json({
      data: clients,
      message: "Clients retrieved successfully",
    });
  } catch (error) {
    next(createHttpError(500, "Error while retrieving clients"));
  }
};

const getSingleClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clientId } = req.params;
  try {
    const client = await clientModel
      .findById(clientId)
      .select("name clientLogo createdAt updatedAt")
      .lean();

    if (!client) {
      return next(createHttpError(404, "Client not found"));
    }

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).json({
      data: client,
      message: "Client retrieved successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while retrieving client"));
  }
};

const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = sanitizeBody(req.body);
  const { clientId } = req.params;

  if (!name || typeof name !== "string") {
    return next(
      createHttpError(
        400,
        "The 'name' field is required and must be a non-empty string."
      )
    );
  }

  const client = await clientModel.findById(clientId).lean();
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
      const mimeExt = newFile.mimetype.split("/").pop();
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: newFile.filename,
        folder: "cp-clients",
        format: mimeExt,
      });
      newSecureUrl = uploadResult.secure_url;
    }

    const updatePayload: Record<string, unknown> = { name };
    if (newSecureUrl) updatePayload.clientLogo = newSecureUrl;

    const updatedClient = await clientModel
      .findByIdAndUpdate(clientId, updatePayload, {
        new: true,
        runValidators: true,
      })
      .select("name clientLogo createdAt updatedAt")
      .lean();

    res.status(200).json({
      data: updatedClient,
      message: "Client updated successfully",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while updating client"));
  } finally {
    if (filePath) await unlinkSafe(filePath);
  }
};

const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId).lean();
  if (!client) {
    return next(createHttpError(404, "Client not found"));
  }

  const clientLogoSplits = client.clientLogo.split("/");
  const lastPart = clientLogoSplits[clientLogoSplits.length - 1];
  const folderPart = clientLogoSplits[clientLogoSplits.length - 2];
  const clientLogoPublicId = `${folderPart}/${lastPart.split(".")[0]}`;

  try {
    await Promise.all([
      cloudinary.uploader.destroy(clientLogoPublicId),
      clientModel.deleteOne({ _id: clientId }),
    ]);
    res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500, "Error while deleting client"));
  }
};

export {
  createClient,
  getAllClient,
  getSingleClient,
  updateClient,
  deleteClient,
};
