import jwt from "jsonwebtoken";

const API_SECRET = process.env.JWT_SECRET!;

export function signJWT(dataToSign: any) {
  return jwt.sign(dataToSign, API_SECRET);
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, API_SECRET);
  } catch (e) {
    return false;
  }
}

export function decodeToken(token: string): any {
  return jwt.decode(token);
}
