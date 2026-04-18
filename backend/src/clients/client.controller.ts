import { Request, Response, NextFunction } from "express";

const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const getAllClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const getSingleClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export {
  createClient,
  getAllClient,
  getSingleClient,
  updateClient,
  deleteClient,
};
