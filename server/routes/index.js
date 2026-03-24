import express from "express";

import adminRoutes from "./admin.routes.js";
import purposeRoutes from "./purpose.routes.js";
import donationRoutes from "./donation.routes.js";

const router = express.Router();

// Grouped routes
app.use("/api/admin", adminRoutes);
app.use("/purposes", purposeRoutes);
app.use(donationRoutes);

export default router;