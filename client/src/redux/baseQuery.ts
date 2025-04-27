import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "./store";

export const customBaseQuery = (route: string) => {
    return fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/v1/${route}`,
        credentials: "include",
        prepareHeaders(headers, { getState }) {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    })
}