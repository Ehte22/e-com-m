import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { IUserProtected } from "../utils/protected"
import { Cart } from "../models/Cart"

// Get All
export const getAllCartItems = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const currentPage: number = parseInt(page as string)
    const pageLimit: number = parseInt(limit as string)
    const skip: number = (currentPage - 1) * pageLimit

    const { userId } = req.user as IUserProtected

    const query: any = {
        $and: [
            { userId },
            { deletedAt: null }
        ]
    }

    const totalEntries = await Cart.countDocuments(query)
    const totalPages = Math.ceil(totalEntries / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await Cart.find(query).populate("productId").sort({ createdAt: -1 }).lean()
    } else {
        result = await Cart.find(query).populate("productId").skip(skip).limit(pageLimit).sort({ createdAt: -1 }).lean()
    }

    const pagination = {
        page: currentPage,
        limit: pageLimit,
        totalEntries,
        totalPages: totalPages
    }

    res.status(200).json({ message: "Cart Items Fetch Successfully", result, pagination })
})

// Get By ID
export const getCartItemById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const result = await Cart.findById(id).lean()

    if (!result) {
        return res.status(404).json({ message: "Cart Not Found" })
    }

    res.status(200).json({ message: "Cart Item Fetch Successfully", result })
})

// Add
export const addCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { productId } = req.body

    const { userId } = req.user as IUserProtected

    const cartItem = await Cart.findOne({ userId, productId }).lean()

    if (cartItem) {
        await Cart.findByIdAndUpdate(cartItem._id, { $inc: { quantity: 1 } })
    } else {
        await Cart.create({ userId, productId })
    }

    res.status(200).json({ message: "Cart Item Add Successfully" })
})

// Delete
export const deleteCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const cartItem = await Cart.findById(id)

    if (!cartItem) {
        return res.status(404).json({ message: "Cart Item Not Found" })
    }

    await Cart.findByIdAndDelete(id)

    res.status(200).json({ message: "Cart Item Delete Successfully" })
})

// Delete All
export const deleteAllCartItems = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { userId } = req.user as IUserProtected

    await Cart.deleteMany({ userId })

    res.status(200).json({ message: "Cart Items Delete Successfully" })
})