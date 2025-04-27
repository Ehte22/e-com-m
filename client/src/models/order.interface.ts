import { IProduct } from "./product.interface"

interface IProducts {
    _id?: string
    productId: IProduct,
    quantity: number
}

export interface IOrder {
    _id?: string
    userId?: string
    products: IProducts[]
    totalAmount: number
    shippingDetails: {
        fullName: string
        address: string
        city: string
        state: string
        zipCode: string
    }
    paymentMethod?: string,
    status?: string
    returnStatus?: string
    returnReason?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}