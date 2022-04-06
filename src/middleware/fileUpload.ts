import path from "path";
import multer from "multer";
import { Request } from "express";

export interface MulterRequest extends Request {
  file: multer.File;
}

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "uploads/images/"));
    },
    filename: (req, file, cb) => {
      let extension = "";
      switch (file.mimetype) {
        case "image/png":
          extension = ".png";
          break;
        case "image/jpeg":
          extension = ".jpg";
          break;
        case "image/gif":
          extension = ".gif";
          break;
      }
      const filename = Date.now() + "-" + Math.round(Math.random() * 1E9) + extension;
      cb(null, filename);
    }
  })
});