import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQuery } from "../baseQuery"

const baseQuery = customBaseQuery("payment")

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery,
    tagTypes: ["payment"],
    endpoints: (builder) => {
        return {
            initiatePayment: builder.mutation<{ message: string, orderId: string, amount: number }, { productId: string, quantity: number }[]>({
                query: Order => {
                    return {
                        url: "/initiate-payment",
                        method: "POST",
                        body: Order
                    }
                },
            }),

            verifyPayment: builder.mutation<{ success: boolean, message: string }, any>({
                query: (paymentData) => {
                    return {
                        url: "/verify-payment",
                        method: "POST",
                        body: paymentData
                    }
                },
            })

        }
    }
})

export const {
    useInitiatePaymentMutation,
    useVerifyPaymentMutation
} = paymentApi
