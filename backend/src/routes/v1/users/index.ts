import { Router } from "express";
import UserModel from "../../../models/User.model";
import { decodeToken, signJWT } from "../../../policy/jwt";
import { useAuthentication } from "../../../policy/useAuthentication";
import { generateId, hashPassword } from "../../../policy/utils";

const router = Router();

router.get("/");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const userDb = await UserModel.findOne({
        email,
        password: hashPassword(password),
      });

      if (!userDb) throw Error();
      else {
        const token = signJWT({ userId: userDb.userId });
        res.status(200).send({
          userId: userDb.userId,
          username: userDb.username,
          email: userDb.email,
          accessToken: token,
        });
      }
    } else throw Error();
  } catch (e) {
    res.status(500).send({ message: "Unauthorized" });
  }
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (username && email && password) {
      const findUser = await UserModel.find({ $or: [{ username }, { email }] });
      if (findUser.length > 0) throw Error("Username/email already in use");

      const userDb = await UserModel.create({
        userId: generateId(),
        username,
        email,
        password: hashPassword(password),
      });

      const token = signJWT({ userId: userDb.userId });
      res.status(200).send({
        userId: userDb.userId,
        username: userDb.username,
        email: userDb.email,
        accessToken: token,
      });
    } else throw Error("Username/email/password missing");
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/info", useAuthentication, async (req, res) => {
  try {
    const { userId } = decodeToken(req.headers.authorization!);

    const getUser = await UserModel.findOne({ userId });
    if (!getUser) throw Error("User not found");
    else {
      res.status(200).send({
        userId: getUser.userId,
        username: getUser.username,
        email: getUser.email,
        accessToken: req.headers.authorization,
      });
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
});

export default router;
