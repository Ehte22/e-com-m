import mongoose, { Document, Model, Schema } from "mongoose"
import { IProduct } from "./Product"

interface IProducts {
    _id?: string
    productId: mongoose.Schema.Types.ObjectId | IProduct
    quantity: number
}

interface IShippingDetails {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
}

export interface IOrder extends Document {
    userId: mongoose.Schema.Types.ObjectId
    products: IProducts[]
    totalAmount: number
    shippingDetails: IShippingDetails
    paymentMethod: "cash" | "online",
    status: "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Returned"
    returnStatus: 'Pending' | 'Approved' | 'Rejected' | 'Completed'
    returnReason: String
    deletedAt: Date | null
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    shippingDetails: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: { type: String, required: true, enum: ["cash", "online"], },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Pending",
    },
    returnStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: null,
    },
    returnReason: { type: String, default: null },
    deletedAt: { type: Date, default: null }
}, { timestamps: true })

export const Order = mongoose.model<IOrder>("Order", orderSchema)