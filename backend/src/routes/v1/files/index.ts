import { Router } from "express";
import multer from "multer";
import FileModel from "../../../models/File.model";
import { decodeToken } from "../../../policy/jwt";
import { useAuthentication } from "../../../policy/useAuthentication";
import { generateId } from "../../../policy/utils";
import fs from "fs";

const allowed_files_type = ["png", "jpg", "jpeg", "pdf"];

const router = Router();
const upload = multer({
  dest: "./src/file_storage/",
  fileFilter: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[1];
    cb(null, allowed_files_type.includes(fileType));
  },
});

router.get("/list", useAuthentication, async (req, res) => {
  if (req.headers.authorization) {
    const { userId } = decodeToken(req.headers.authorization);
    const allFiles = await FileModel.find({ ownerId: userId });

    res.status(200).send({ files: allFiles });
  }
});

router.post("/upload", upload.any(), useAuthentication, async (req, res) => {
  try {
    if (req.files && req.files.length == 1 && req.headers.authorization) {
      const { userId } = decodeToken(req.headers.authorization);

      //@ts-ignore
      const { originalname, mimetype, size, filename } = req.files[0];

      const fileInfo = await FileModel.create({
        fileId: filename,
        name: originalname,
        size,
        mime: mimetype,
        fileType: "file",
        extension: mimetype.split("/")[1],
        ownerId: userId,
        folderId: "empty",
      });

      res.status(200).send({ message: "File uploaded", file: fileInfo });
    } else {
      res.status(404).send({ message: "File not uploaded" });
    }
  } catch (e: any) {
    console.log(e.message);

    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post(
  "/create-folder",
  upload.none(),
  useAuthentication,
  async (req, res) => {
    try {
      if (req.headers.authorization) {
        const { userId } = decodeToken(req.headers.authorization);

        //@ts-ignore
        const { name } = req.body;

        const fileInfo = await FileModel.create({
          fileId: generateId(),
          name,
          size: 0,
          mime: "folder",
          fileType: "folder",
          extension: "folder",
          ownerId: userId,
          folderId: "empty",
        });

        res.status(200).send({ message: "Folder created", file: fileInfo });
      } else {
        res.status(404).send({ message: "Folder not created" });
      }
    } catch (e: any) {
      res.status(500).send({ message: e.message });
    }
  }
);

router.delete("/", useAuthentication, async (req, res) => {
  try {
    if (req.headers.authorization) {
      const { fileId } = req.body;
      const { userId } = decodeToken(req.headers.authorization);

      const getFile = await FileModel.findOne({ fileId, ownerId: userId });
      if (!getFile) throw Error("File not found");
      else {
        getFile.delete();

        fs.unlinkSync(`src/file_storage/${fileId}`);

        res.status(200).send({ message: "File deleted" });
      }
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
});

router.put("/", useAuthentication, async (req, res) => {
  try {
    if (req.headers.authorization) {
      const { fileId, name } = req.body;
      const { userId } = decodeToken(req.headers.authorization);

      const getFile = await FileModel.findOne({ fileId, ownerId: userId });
      if (!getFile) throw Error("File not found");
      else {
        getFile.name = name;
        await getFile.save();
        res.status(200).send({ message: "File updated", file: getFile });
      }
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/serve/:fileId", useAuthentication, async (req, res) => {
  try {
    if (req.headers.authorization) {
      const { fileId } = req.params;
      const { userId } = decodeToken(req.headers.authorization);

      const getFileFromDB = await FileModel.findOne({
        fileId,
        ownerId: userId,
      });

      if (!getFileFromDB) throw Error("File not found");

      const getFileFromStorage = fs.readFileSync(`src/file_storage/${fileId}`);

      if (!getFileFromStorage) throw Error("File not found");

      const fileLength = getFileFromStorage.length;

      res
        .writeHead(200, {
          "Content-Type": getFileFromDB.mime,
          "Content-Length": fileLength,
          "X-File-Name": getFileFromDB.name,
        })
        .end(getFileFromStorage);
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
});

router.put("/move/:fileId/:dirId", useAuthentication, async (req, res) => {});

export default router;
