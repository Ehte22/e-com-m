import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import razorpay from "razorpay"
import { v4 as uuid } from "uuid"
import crypto from "crypto"
import dotenv from "dotenv"
import { Product } from "../models/Product"

dotenv.config()

export const initiatePayment = asyncHandler(async (req: Request, res): Promise<any> => {

    const instance = new razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    const data = req.body as { productId: string; quantity: number }[]

    const productIds = data.map((item) => item.productId)

    const products = await Product.find({ _id: { $in: productIds } }).lean()

    if (!products || products.length === 0) {
        return res.status(404).json({ message: "Products not found" });
    }

    let amount = 0
    for (const item of data) {
        const product = products.find(p => p._id.toString() === item.productId)

        if (product) {
            amount += product.price * Number(item.quantity)
        }
    }

    const tax = amount * 18 / 100
    amount = amount + tax

    if (amount) {
        instance.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: uuid()
        }, (err: any, order) => {
            if (err) {
                return res.status(500).json({ message: err.message || "Unable to process request" })
            }
            return res.status(200).json({ message: "Initiate success", orderId: order.id, amount })
        })
    }
})

export const verifyPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature === razorpay_signature) {
        return res.json({ success: true, message: "Payment successful" });
    } else {
        return res.status(400).json({ message: "Payment verification failed" });
    }
});
