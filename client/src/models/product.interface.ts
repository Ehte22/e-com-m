export interface IProduct {
    _id?: string
    name: string
    price: string
    desc: string
    category: string
    image: string
    status?: "active" | "inactive"
    deletedAt?: Date | null
    createdAt?: Date
    updatedAt?: Date
}