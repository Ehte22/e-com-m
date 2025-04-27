import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/auth.api";
import { IUser } from "../../models/user.interface";

interface InitialState {
    user: IUser | null
    token: string | null
}

const initialState: InitialState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null,
    token: localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token") as string)
        : null,
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
            localStorage.setItem("user", JSON.stringify(payload.result))
            localStorage.setItem("token", JSON.stringify(payload.token))
            state.user = payload.result
            state.token = payload.token
        })
        .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            state.user = null
        })
})


export default authSlice.reducer

export type { InitialState }