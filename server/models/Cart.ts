import mongoose, { Document, Model, Schema } from "mongoose"

export interface ICart extends Document {
    userId: mongoose.Schema.Types.ObjectId
    productId: mongoose.Schema.Types.ObjectId
    quantity: number
    deletedAt: Date | null
}

const cartSchema = new Schema<ICart>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

export const Cart = mongoose.model<ICart>("Cart", cartSchema)