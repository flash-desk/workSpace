import multer from "multer";
import AppError from "../errors/AppError.js";
import httpStateText from "../utils/httpStateText.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const uploadMemory = (size, noOfFiles) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
      cb(
        AppError.create(
          "Only JPG, PNG or WEBP images are allowed",
          400,
          httpStateText[400],
        ),
        false,
      );
    },
    limits: {
      fileSize: size * 1024 * 1024,
      files: noOfFiles,
      fields: 10,
    },
  });

export default uploadMemory;
