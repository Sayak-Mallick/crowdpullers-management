import mongoose from "mongoose";
import { Client } from "./client.types";

const clientModel = new mongoose.Schema<Client>(
  {
    name: {
      type: String,
      required: true,
    },
    clientLogo: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Client>("Client", clientModel);
