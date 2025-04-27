import mongoose, { Document, Schema } from "mongoose"

export interface IProduct extends Document {
    name: string
    price: number
    desc: string
    category: string
    image: string
    status: "active" | "inactive"
    deletedAt: Date | null
}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    deletedAt: { type: Date, default: null },
}, { timestamps: true })

export const Product = mongoose.model<IProduct>("Product", productSchema)