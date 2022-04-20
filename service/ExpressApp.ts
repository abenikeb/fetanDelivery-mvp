import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import {
  // AdminRoute,
  UserRoute,
  // CustomerRoute,
  // DeliveryRoute,
  // VendorRoute,
} from "../router";
import { error } from "../middleware/error";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  // app.use("/", CustomerRoute);
  // app.use("/admin", AdminRoute);
  app.use("/user", UserRoute);
  // app.use("/delivery", DeliveryRoute);
  // app.use("/vendor", VendorRoute);
  app.use(error);

  return app;
};
