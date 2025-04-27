import { IProduct } from "./product.interface"

export interface ICart {
    _id?: string
    userId: string
    productId: IProduct
    quantity?: number
    createdAt?: Date
    updateAt?: Date
    deletedAt?: Date
}

export interface ICartItems {
    cartItemData: ICart[]
    totalAmount: number
}
