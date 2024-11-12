const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51QIdm2B1QJBWRwyCWMJ4YVjxaVuI75yiFBCUsYCeteprcH6De0Elt6sdwVNmvq82o3rPirvTZR3qVW0ccGq8N9SB00tnYRoNb0"); // Replace with your test Stripe secret key
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

// Endpoint to create Stripe Checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { reservationId, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name: `Reservation for Field ${reservationId}`,
            },
            unit_amount: price * 100, // Stripe amount is in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/confirmation-page?session_id={CHECKOUT_SESSION_ID}`, // Pass session ID in URL
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3002, () => {
  console.log("Server is running on port 3001");
});
