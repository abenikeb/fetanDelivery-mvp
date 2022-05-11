import express, { Request, Response, NextFunction } from "express";
import {
  CreateVendor,
  //   GetDeliveryBoys,
  //   GetTransaction,
  //   GetTransactionByID,
  //   GetVandorByID,
  //   GetVanndors,
  //   VerifyDeliveryBoys,
} from "../controller";
import { Authenticate, AdminAuth } from "../middleware";

const router = express.Router();

router.post("/vendor", [Authenticate, AdminAuth], CreateVendor);
// router.get("/vandors", GetVanndors);
// router.get("/vandor/:id", GetVandorByID);
// router.get("/transaction", GetTransaction);
// router.get("/transaction/:id", GetTransactionByID);
// router.get("/deliveries", GetDeliveryBoys);
// router.put("/verify-deliveries/:id", VerifyDeliveryBoys);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Heye there! this is Fetan Delivery Admin DashBoard" });
});

export { router as AdminRoute };
