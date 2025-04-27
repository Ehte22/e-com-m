import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQuery } from "../baseQuery"
import { IPagination } from "../../models/pagination.interface"
import { ICart } from "../../models/cart.interface"

const baseQuery = customBaseQuery("cart")

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery,
    tagTypes: ["cart"],
    endpoints: (builder) => {
        return {
            getCartItems: builder.query<{ result: ICart[], pagination: IPagination }, Partial<{ page: number, limit: number, searchQuery: string, isFetchAll: boolean }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: ICart[], pagination: IPagination }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["cart"]
            }),

            getCartItemById: builder.query<ICart, string>({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: ICart }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["cart"]
            }),

            addCartItem: builder.mutation<string, { productId: string }>({
                query: cartItemData => {
                    return {
                        url: "/add",
                        method: "POST",
                        body: cartItemData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["cart"]
            }),

            deleteCartItem: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/delete/${id}`,
                        method: "PUT",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["cart"]
            }),

            deleteAllCartItems: builder.mutation<string, void>({
                query: () => {
                    return {
                        url: `/delete-all`,
                        method: "PUT",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["cart"]
            })

        }
    }
})

export const {
    useGetCartItemsQuery,
    useGetCartItemByIdQuery,
    useAddCartItemMutation,
    useDeleteCartItemMutation,
    useDeleteAllCartItemsMutation
} = cartApi
