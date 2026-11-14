import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import AppError from "../errors/AppError.js";
import httpStateText from "../utils/httpStateText.js";

export const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || "uploads");

const baseUrl = () =>
  (process.env.SERVER_URL || `http://localhost:${process.env.PORT_NUMBER}`).replace(/\/$/, "");

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const detectExtension = (buf) => {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(PNG_SIGNATURE)) return "png";
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  return null;
};

export const saveImage = async (buffer, folder) => {
  const ext = detectExtension(buffer);
  if (!ext) {
    throw AppError.create("Invalid image file", 400, httpStateText[400]);
  }
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;
  const target = path.join(UPLOADS_DIR, key);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, buffer);
  return { key, url: `${baseUrl()}/uploads/${key}` };
};

export const deleteImage = async (key) => {
  if (!key) return;
  const target = path.resolve(UPLOADS_DIR, key);
  if (!target.startsWith(UPLOADS_DIR + path.sep)) return;
  await fs.unlink(target).catch((err) => {
    if (err.code !== "ENOENT") throw err;
  });
};
