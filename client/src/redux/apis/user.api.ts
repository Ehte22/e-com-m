import { createApi } from "@reduxjs/toolkit/query/react"
import { IUser } from "../../models/user.interface"
import { customBaseQuery } from "../baseQuery"
import { IPagination } from "../../models/pagination.interface"

const baseQuery = customBaseQuery("user")

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    tagTypes: ["user"],
    endpoints: (builder) => {
        return {
            getUsers: builder.query<{ result: IUser[], pagination: IPagination }, Partial<{ page: number, limit: number, searchQuery: string, isFetchAll: boolean, selectedUser: string }>>({
                query: (queryParams = {}) => {
                    return {
                        url: "/",
                        method: "GET",
                        params: queryParams
                    }
                },
                transformResponse: (data: { result: IUser[], pagination: IPagination }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["user"]
            }),

            getUserById: builder.query<IUser, string>({
                query: (id) => {
                    return {
                        url: `/${id}`,
                        method: "GET"
                    }
                },
                transformResponse: (data: { result: IUser }) => {
                    return data.result
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                providesTags: ["user"]
            }),

            addUser: builder.mutation<{ message: string, result: IUser }, FormData>({
                query: userData => {
                    return {
                        url: "/add",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string, result: IUser }) => {
                    return data
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["user"]
            }),

            updateUser: builder.mutation<string, { id: string, userData: FormData }>({
                query: ({ id, userData }) => {
                    return {
                        url: `/update/${id}`,
                        method: "PUT",
                        body: userData
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["user"]
            }),

            updateUserStatus: builder.mutation<string, { id: string, status: string }>({
                query: ({ id, status }) => {
                    return {
                        url: `/status/${id}`,
                        method: "PUT",
                        body: { status }
                    }
                },
                transformResponse: (data: { message: string }) => {
                    return data.message
                },
                transformErrorResponse: (error: { status: number, data: { message: string } }) => {
                    return error.data?.message
                },
                invalidatesTags: ["user"]
            }),

            deleteUser: builder.mutation<string, string>({
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
                invalidatesTags: ["user"]
            }),

        }
    }
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation
} = userApi
