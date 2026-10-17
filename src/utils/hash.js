import crypto from "crypto";

// SHA-256 is enough for random, high-entropy tokens (refresh tokens, OTPs,activation/reset tokens)
export const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const generateOpaqueToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const generateNumericOTP = () =>
  crypto.randomInt(100000, 1000000).toString();
