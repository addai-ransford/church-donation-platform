import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


router.post("/create-donation-intent", async (req, res) => {
  try {
    const { amount, fund } = req.body;
    if (!amount || amount < 1) return res.status(400).json({ error: "Invalid amount" });

    const intent = await stripe.paymentIntents.create({
      amount: Math.floor(amount * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: { fund }, 
    });

    res.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create donation intent" });
  }
});

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const amount = intent.amount / 100;
      const paymentId = intent.id;
      const fund = intent.metadata.fund || "general";

      return;
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