import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(
      password,
      "3f92e71009164935ff9b7a064bae8b51",
      1000,
      64,
      `sha512`
    )
    .toString(`hex`);
}

export function generateId() {
  const id = uuidv4();
  return id.replace(/-/g, "");
}
