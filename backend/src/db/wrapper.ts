import mongoose from "mongoose";

export function startDatabase(
  hostname: string,
  name: string,
  username: string,
  password: string
) {
  if (hostname && name && username) {
    const DB_URI = `mongodb+srv://${username}:${password}@${hostname}/${name}?retryWrites=true&writeConcern=majority`;

    mongoose
      .connect(DB_URI)
      .then(() => {
        console.log("[MONGODB] Connected!");
      })
      .catch((err) => {
        console.log(`[MONGODB] Error`, err.message);
      });
  } else throw Error("DB configuration is empty");
}
