import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import { db, FieldValue } from "../firebaseAdmin.js";
import { COLLECTIONS } from "../config/index.js";


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


router.post("/create-donation-intent", async (req, res) => {

  try {
    const { amount, fund } = req.body;
    const fee = Math.ceil((amount * 0.014 + 0.35) * 100) / 100;
    if (!amount || amount < 5) return res.status(400).json({ error: "Invalid amount" });
    const intent = await stripe.paymentIntents.create({
      amount: Math.floor((amount + fee) * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: {
        fund,
        fee: fee.toString(),
        baseAmount: amount.toString(),
      },
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create donation intent" });
  }
});

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const amount = intent.metadata.baseAmount / 100;
      const paymentId = intent.id;
      const fund = intent.metadata.fund || "general";

      try {
        // Save to Firestore
        await db.collection(COLLECTIONS.donations).doc(paymentId).set({
          paymentId,
          fund,
          amount,
          status: "succeeded",
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`Donation saved: ${paymentId} -> ${fund} €${amount}`);
      } catch (err) {
        console.error("Failed to save donation:", err);
        return res.status(500).send("Failed to save donation");
      }
    }

    res.json({ received: true });
  }
);



router.get("/config", (req, res) => {
  res.json({
    stripePublicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
  });
});

export default router;