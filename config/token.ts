import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export function decodeJWT(token: string): JwtPayload | null {
  try {
    const cleanedToken = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    // console.log("Cleaned Token:", cleanedToken);

    const decoded = jwt.verify(cleanedToken, JWT_SECRET) as JwtPayload;
    // console.log("Decoded Payload:", decoded);

    return decoded;
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
}
export function decodeRefreshJWT(token: string): { payload: JwtPayload } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
    return { payload: decoded };
  } catch {
    return null;
  }
}
