import express from "express";
import { db, FieldValue } from "../firebaseAdmin.js";
import { COLLECTIONS } from "../config/index.js";


const router = express.Router();
router.use(express.json());

router.get("/totals", async (req, res) => {
    try {
        const purposesSnap = await db.collection(COLLECTIONS.purposes).get();

        const donationsSnap = await db
            .collection(COLLECTIONS.donations)
            .where("status", "==", "succeeded")
            .get();

        const totalsMap = {};

        donationsSnap.docs.forEach((doc) => {
            const data = doc.data();
            const fundId = data.fund;
            const amount = data.amount || 0;

            if (!fundId) return;

            totalsMap[fundId] = (totalsMap[fundId] || 0) + amount;
        });

        const results = purposesSnap.docs.map((doc) => {
            const id = doc.id;
            const data = doc.data();

            return {
                id,
                label: data.label,
                totalAmount: totalsMap[id] || 0,
                isActive: data.isActive
            };
        });

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch totals" });
    }
});

router.post("/purposes", async (req, res) => {
    try {
        const { label } = req.body;
        const docRef = await db.collection(COLLECTIONS.purposes).add({
            label,
            createdAt: FieldValue.serverTimestamp(),
            isActive: true,
        });
        res.json({ id: docRef.id, label, isActive: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to create purpose" });
    }
});

router.delete("/purposes/:id", async (req, res) => {
    try {
        await db.collection(COLLECTIONS.purposes).doc(req.params.id).delete();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});


router.patch("/purposes/:id/status", async (req, res) => {
    try {
        const { isActive } = req.body;
        if (typeof isActive !== "boolean") {
            return res.status(400).json({ error: "isActive must be a boolean" });
        }

        await db.collection(COLLECTIONS.purposes).doc(req.params.id).update({ isActive });
        res.json({ success: true, id: req.params.id, isActive });
    } catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});

export default router;
