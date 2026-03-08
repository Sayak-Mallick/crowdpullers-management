import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT || 4100,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,
  env: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || "",
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
};

export const config = Object.freeze(_config);
