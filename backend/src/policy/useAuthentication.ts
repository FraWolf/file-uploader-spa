import type { NextFunction, Request, Response } from "express";
import { verifyJWT } from "./jwt";

export function useAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && verifyJWT(authorizationHeader)) next();
  else return res.status(401).send({ message: "Unauthorized" });
}
