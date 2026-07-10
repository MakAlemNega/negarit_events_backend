import jwt from "jsonwebtoken";

export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role }, // payload — identity only, nothing sensitive
    process.env.JWT_SECRET, // the signing key
    { expiresIn: "7d" }, // wristband expires after 7 days
  );
}
