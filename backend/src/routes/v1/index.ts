import { Router } from "express";
import users from "./users/index";
import files from "./files/index";

const router = Router();

router.get("/", async (req, res) => {
  return res.status(200).send({ message: "System Operational" });
});

router.use("/users", users);
router.use("/files", files);

export default router;
