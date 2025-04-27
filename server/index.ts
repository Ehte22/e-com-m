import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import redisClient from "./services/redisClient";
import passport from "./services/passport"
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { protectedRoute } from "./utils/protected";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.static("invoices"))
app.use(morgan("dev"))

// app.use(rateLimit({
//     windowMs: 1000 * 60 * 15,
//     max: 50,
//     message: "We have received to many request from this IP. Please try after 15 minutes."
// }))

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: true,
    credentials: true
}))

app.use(passport.initialize())

redisClient.on("connect", () => {
    console.log('Connected to Redis');
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", protectedRoute, userRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/cart", protectedRoute, cartRoutes)
app.use("/api/v1/order", protectedRoute, orderRoutes)
app.use("/api/v1/payment", protectedRoute, paymentRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Resource not found", });
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: "Something went wrong", error: err.message });
})

mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

const PORT = process.env.PORT || 5000
mongoose.connection.once("open", async () => {
    console.log(`MongoDb Connected`);
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
});

