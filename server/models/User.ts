import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    _id?: string;
    name: string;
    email: string;
    phone: string
    username?: string;
    password: string;
    confirmPassword?: string
    profile?: string
    role: 'Admin' | 'User'
    status: 'active' | 'inactive'
    deletedAt: Date | null
}

export interface IOTP extends Document {
    username: string
    otp: string
    expiry: Date
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    password: { type: String, trim: true },
    profile: { type: String, trim: true },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: "User",
    },
    status: { type: String, default: "active", enum: ['active', 'inactive'] },
    deletedAt: { type: Date, default: null }
}, { timestamps: true });

const OTPSchema = new Schema<IOTP>({
    username: { type: String },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true }
}, { timestamps: true })

export const User = mongoose.model<IUser>("User", userSchema);
export const OTP = mongoose.model<IOTP>("Otp", OTPSchema)

