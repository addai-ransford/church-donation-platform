import express from "express";

import adminRoutes from "./admin.routes.js";
import authRoutes from "../auth/auth.routes.js"
import purposeRoutes from "./purpose.routes.js";
import donationRoutes from "./donation.routes.js";

const router = express.Router();

// Grouped routes
router.use("/api/auth", authRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/purposes", purposeRoutes);
router.use(donationRoutes);

export default router;