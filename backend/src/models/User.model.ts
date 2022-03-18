import { model, Schema } from "mongoose";
import { User } from "../types/user";

const UserSchema = new Schema<User>({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default model("user", UserSchema);
