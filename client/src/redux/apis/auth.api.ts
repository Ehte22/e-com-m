import { createApi } from "@reduxjs/toolkit/query/react"
import { customBaseQuery } from "../baseQuery";
import { IUser } from "../../models/user.interface";

const baseQuery = customBaseQuery("auth")

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQuery,
    endpoints: (builder) => {
        return {
            signUp: builder.mutation<{ message: string, result: IUser }, IUser>({
                query: userData => {
                    return {
                        url: "/sign-up",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IUser }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            signIn: builder.mutation<{ message: string, result: IUser, token: string }, { username: string, password: string }>({
                query: userData => {
                    return {
                        url: "/sign-in",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IUser, token: string }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            signOut: builder.mutation<string, void>({
                query: () => {
                    return {
                        url: "/sign-out",
                        method: "POST",
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            sendOTP: builder.mutation<string, { username: string }>({
                query: (username) => {
                    return {
                        url: "/send-otp",
                        method: "POST",
                        body: username
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            verifyOTP: builder.mutation<string, { username: string, otp: string }>({
                query: (userData) => {
                    return {
                        url: "/verify-otp",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            forgotPassword: builder.mutation<string, string>({
                query: (email) => {
                    return {
                        url: "/forgot-password",
                        method: "POST",
                        body: { email }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),

            resetPassword: builder.mutation<string, { password: string, confirmPassword: string, token: string }>({
                query: (passwordData) => {
                    return {
                        url: "/reset-password",
                        method: "PUT",
                        body: passwordData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                }
            }),


        }
    }
})

export const {
    useSignUpMutation,
    useSignInMutation,
    useSignOutMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = authApi
