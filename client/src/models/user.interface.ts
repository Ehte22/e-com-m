export interface IUser {
    _id?: string
    name: string;
    email: string;
    phone: number
    username?: string;
    password?: string;
    confirmPassword?: string
    profile?: string
    role: 'Admin' | 'User'
    status?: 'active' | 'inactive'
    createAt?: Date
    updateAt?: Date
    deletedAt?: Date
}