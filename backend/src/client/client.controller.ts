import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import clientModel from "./client.model";
import createHttpError from "http-errors";

const creatClient = async (req: Request, res: Response, next: NextFunction) => {
  // Sanitize the request body by trimming keys and values
  const sanitizedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [
      key.trim(),
      typeof value === "string" ? value.trim() : value,
    ]),
  );

  const { name } = sanitizedBody;
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

  const clientImageMimetype = files.clientLogo[0].mimetype.split("/").at(-1);
  const fileName = files.clientLogo[0].filename;
  const filePath = path.resolve(
    __dirname,
    "../../public/uploads/clients",
    fileName,
  );

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "cp-clients",
      format: clientImageMimetype,
    });

    const newClient = await clientModel.create({
      name: name,
      clientLogo: uploadResult.secure_url,
      // addedBy: "69acc2f95e1b8bb5f720e7a4",
    });

    // Delete the local file after uploading to Cloudinary
    await fs.promises.unlink(filePath);
    res.status(201).json({
      id: newClient._id,
      message: "Client created successfully",
    });
  } catch (error) {
    console.error("Error details:", error); // Log the error details for debugging
    return next(createHttpError(500, "Error while uploading files"));
  }
};

const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await clientModel.find();
    res.status(200).json({
      data: clients,
      message: "Clients retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, "Error while retrieving clients"));
  }
};

export { creatClient, getClients };
