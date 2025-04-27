import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { customValidator } from "../utils/validator"
import { Order } from "../models/Order"
import { orderRules } from "../rules/order.rules"
import { IUserProtected } from "../utils/protected"
import mongoose from "mongoose"

// Get All
export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const { userId, role } = req.user as IUserProtected

    const currentPage: number = parseInt(page as string)
    const pageLimit: number = parseInt(limit as string)
    const skip: number = (currentPage - 1) * pageLimit

    const query: any = {
        $and: [
            role !== "Admin" ? { userId } : {},
            { deletedAt: null },
            searchQuery
                ? {
                    $or: [
                        { _id: mongoose.Types.ObjectId.isValid(searchQuery as string) ? new mongoose.Types.ObjectId(searchQuery as string) : undefined }
                    ].filter(Boolean)
                } : {}
        ]
    }

    const totalEntries = await Order.countDocuments(query)
    const totalPages = Math.ceil(totalEntries / pageLimit)


    let result = []
    if (isFetchAll) {
        result = await Order.find(query).populate("products.productId").sort({ createdAt: -1 }).lean()
    } else {
        result = await Order.find(query).populate("products.productId").skip(skip).limit(pageLimit).sort({ createdAt: -1 }).lean()
    }

    const pagination = {
        page: currentPage,
        limit: pageLimit,
        totalEntries,
        totalPages: totalPages
    }

    res.status(200).json({ message: "Orders Fetch Successfully", result, pagination })
})

// Get By ID
export const getOrderById = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const result = await Order.findById(id).lean()

    if (!result) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    res.status(200).json({ message: "Order Fetch Successfully", result })
})

// Add
export const addOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { paymentMethod } = req.body
    const { userId } = req.user as IUserProtected

    const { isError, error } = customValidator(req.body, orderRules)

    if (isError) {
        return res.status(422).json({ message: "Validation Error", error })
    }

    const result = await Order.create({ ...req.body, userId, paymentMethod })

    res.status(200).json({ message: "Order Add Successfully", result })
})

// Update Status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params
    const { status, returnStatus } = req.body

    const order = await Order.findById(id).lean()
    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status, returnStatus }, { new: true, runValidators: true })
    res.status(200).json({ message: "Order Status Update Successfully" })
})

// Cancel Order
export const cancelOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true, runValidators: true })

    res.status(200).json({ message: "Order Delete Successfully" })
})

// Return Order
export const returnOrderRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { returnStatus: "Pending", returnReason: req.body.returnReason })
    res.status(200).json({ message: "Order Return Requested Successfully" })
})

