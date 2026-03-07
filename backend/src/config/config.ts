import { config as conf } from "dotenv";
conf();

const _config = {
  PORT: process.env.PORT || 4100,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,
  env: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || "",
}

export const config = Object.freeze(_config);