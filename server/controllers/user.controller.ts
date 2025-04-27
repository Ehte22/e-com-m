import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { IUserProtected } from "../utils/protected"
import { customValidator } from "../utils/validator"
import cloudinary from "../utils/uploadConfig"
import { IUser, User } from "../models/User"
import { registerRules } from "../rules/user.rules"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken"

// Get All
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const currentPage: number = parseInt(page as string)
    const pageLimit: number = parseInt(limit as string)
    const skip: number = (currentPage - 1) * pageLimit

    const query: any = {
        $and: [
            { deletedAt: null },
            { role: { $ne: "Admin" } },
            searchQuery
                ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: "i" } },
                        { email: { $regex: searchQuery, $options: "i" } },
                        { phone: { $regex: searchQuery, $options: "i" } }
                    ]
                }
                : {}
        ]
    }

    const totalEntries = await User.countDocuments(query)
    const totalPages = Math.ceil(totalEntries / pageLimit)

    let result: any[] = []
    if (isFetchAll) {
        result = await User.find(query).sort({ createdAt: -1 }).lean()
    } else {
        result = await User.find(query).skip(skip).limit(pageLimit).sort({ createdAt: -1 }).lean()
    }

    const pagination = {
        page: currentPage,
        limit: pageLimit,
        totalEntries,
        totalPages: totalPages
    }

    res.status(200).json({ message: "Users Fetch Successfully", result, pagination })
})

// Get By ID
export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const result = await User.findById(id).lean()

    if (!result) {
        return res.status(404).json({ message: "User Not Found" })
    }

    res.status(200).json({ message: "User Fetch Successfully", result })
})

// Update
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const { email, phone, remove } = req.body;

    const user = await User.findById(id).lean();
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    if (email && email !== user.email) {
        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(409).json({ message: "Email Already Exists" });
        }
    }

    if (phone && phone !== user.phone) {
        const existingPhoneUser = await User.findOne({ phone }).lean();
        if (existingPhoneUser) {
            return res.status(409).json({ message: "Phone Number Already Exists" });
        }
    }

    let profile = user.profile;
    if (req.file) {
        const publicId = user.profile?.split("/").pop()?.split(".")[0];
        publicId && await cloudinary.uploader.destroy(publicId);

        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        profile = secure_url;
    }

    if (remove === "true") {
        const publicId = user.profile?.split("/").pop()?.split(".")[0]
        if (publicId) {
            await cloudinary.uploader.destroy(publicId)
            profile = ""
        }
    }

    const updatedData = { ...req.body, profile };

    await User.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    res.status(200).json({ message: "User Updated Successfully" });
})

// Update Status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const { status } = req.body

    const user = await User.findById(id).lean()
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }

    await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
    res.status(200).json({ message: "User Status Update Successfully" })
})

// Delete
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }

    await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true, runValidators: true })

    res.status(200).json({ message: "User Delete Successfully" })
})
