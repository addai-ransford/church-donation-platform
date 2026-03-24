import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snap = await db.collection("purposes").where("isActive", "==",true).get();

    const purposes = snap.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().label,
    }));

    res.json(purposes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purposes" });
  }
});

export default router;