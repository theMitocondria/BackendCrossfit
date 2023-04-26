import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./database.js";
import UserRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import ProductRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js"
import chatRouter from "./routes/chatRouter.js";
import planRouter from "./routes/planRoutes.js";
import Order from "./models/order.js";
import Stripe from "stripe";
import TestimonialROuter from "./routes/testimonialRoutes.js";
import improveRouter from "./routes/improveRoutes.js";
import feedbackRouter from "./routes/feebackRoutes.js"
dotenv.config()
const app = express()
connectDatabase();
app.use(cors())
app.use(express.static("public"));
// app.use('/static', express.static('public'))

const stripe = new Stripe(process.env.STRIPE_KEY)


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_10a1455326746e589baf3de35ac583a0ace670b6fc30497b54b421d7beae553b";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async(request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event);
    } catch (err) {
        console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if(event.type === "checkout.session.completed"){
      //update the order
      const session = event.data.object;
      const {orderId} = session.metadata;
      const paymentStatus = session.payment_status;
    //   const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
    //   const currency = session.currency;
      

      //find the order
      const order = await Order.findByIdAndUpdate(JSON.parse(orderId),
        {
          amount: totalAmount /100,
          paymentStatus,
        },
        {
          new : true,
        })

        
    }else{
      return;
    }

    // Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntentSucceeded = event.data.object;
    //     // Then define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);



app.use(express.json());



app.use("/api/v1/users", UserRouter);
app.use("/api/v1/post", postRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/product", ProductRouter)
app.use("/api/v1/order", orderRouter);
app.use("/api/v1", chatRouter)
app.use("/api/v1", planRouter)
app.use("/api/v1/testimonial", TestimonialROuter)
app.use("/api/v1/improve", improveRouter)
app.use("/api/v1", feedbackRouter);

app.listen(process.env.PORT,  () => {
    console.log(`Port is running at ${process.env.PORT}`)
})