import mongoose from "mongoose";
import { Client } from "./client.types";

const clientSchema = new mongoose.Schema<Client>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clientLogo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Index so sorted reads (find + sort by createdAt) hit the index, not a full scan
clientSchema.index({ createdAt: -1 });

export default mongoose.model<Client>("Client", clientSchema);
