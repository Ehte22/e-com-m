import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQuery } from "../baseQuery"
import { IPagination } from "../../models/pagination.interface"
import { IOrder } from "../../models/order.interface"

const baseQuery = customBaseQuery("order")

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery,
    tagTypes: ["order"],
    endpoints: (builder) => {
        return {
            getOrders: builder.query<{ result: IOrder[], pagination: IPagination }, Partial<{ page: number, limit: number, searchQuery: string, isFetchAll: boolean, }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IOrder[], pagination: IPagination }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["order"]
            }),

            getOrderById: builder.query<IOrder, string>({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IOrder }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["order"]
            }),

            addOrder: builder.mutation<{ message: string, result: IOrder }, IOrder>({
                query: orderData => {
                    console.log(orderData);

                    return {
                        url: "/add",
                        method: "POST",
                        body: orderData
                    }
                },
                transformResponse: (data: { message: string, result: IOrder }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["order"]
            }),

            updateOrder: builder.mutation<string, { id: string, orderData: IOrder }>({
                query: ({ id, orderData }) => {
                    return {
                        url: `/update/${id}`,
                        method: "PUT",
                        body: orderData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["order"]
            }),

            updateOrderStatus: builder.mutation<string, { id: string, status: string, returnStatus: string | null }>({
                query: ({ id, status, returnStatus }) => {
                    return {
                        url: `/status/${id}`,
                        method: "PUT",
                        body: { status, returnStatus }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["order"]
            }),

            cancelOrder: builder.mutation<string, string>({
                query: (id) => {
                    return {
                        url: `/cancel/${id}`,
                        method: "PUT",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["order"]
            }),

            returnOrderRequested: builder.mutation<string, { id: string, returnReason: string }>({
                query: ({ id, returnReason }) => {
                    return {
                        url: `/return/${id}`,
                        method: "PUT",
                        body: { returnReason }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data.message
                },
                invalidatesTags: ["order"]
            }),

        }
    }
})

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useAddOrderMutation,
    useUpdateOrderMutation,
    useUpdateOrderStatusMutation,
    useCancelOrderMutation,
    useReturnOrderRequestedMutation
} = orderApi
