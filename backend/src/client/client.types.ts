import { User } from "../user/user.types";

export interface Client {
  _id: string;
  name: string;
  clientLogo: string;
  // addedBy: User;
  createdAt: Date;
  updatedAt: Date;
}
