import express from "express";
import {
  AddGrocery,
  GetGroceries,
  GetOrdersVandor,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VenderLogin,
  GetOrdersDetail,
  ProcessOrder,
} from "../controller";

import { Authenticate } from "../middleware/CommonAuth";
import multer from "multer";
const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "images");
  },
  filename: function (req: any, file: any, cb: any) {
    // cb(null, new Date().toISOString() + '_' + file.originalname)
    cb(null, file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VenderLogin);

//profile section
router.get("/profile", GetVendorProfile);
router.post("/updateProfile", UpdateVendorProfile);
router.post("/updateCover", images, UpdateVendorCoverImage);
router.post("/updateService", UpdateVendorService);

//product section
router.post("/grocery", images, AddGrocery);
router.get("/groceries", GetGroceries);

//order section
router.get("/orders", GetOrdersVandor);
router.put("/orders/:id/process", ProcessOrder);
router.get("/order/:id", GetOrdersDetail);

export { router as VendorRoute };
