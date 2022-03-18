import { model, Schema } from "mongoose";
import { File } from "../types/files";

const FileSchema = new Schema<File>({
  fileId: { type: String, required: true },
  name: { type: String, required: true },
  fileType: { type: String, required: true },
  nested: { type: Array, required: true, default: [] },
  inFolder: { type: Boolean, required: true, default: false },
  folderId: { type: String, required: true, default: null },
  size: { type: Number, required: true },
  mime: { type: String, required: true },
  extension: { type: String, required: true },
  ownerId: { type: String, required: true },
});

export default model("file", FileSchema);
