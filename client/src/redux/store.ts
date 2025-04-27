import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth.api";
import { userApi } from "./apis/user.api";
import { productApi } from "./apis/product.api";
import { cartApi } from "./apis/cart.api";
import authSlice from "./slices/auth.slice"
import cartSlice from "./slices/cart.slice"
import { orderApi } from "./apis/order.api";
import { paymentApi } from "./apis/payment.api";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        auth: authSlice,
        cart: cartSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            productApi.middleware,
            cartApi.middleware,
            orderApi.middleware,
            paymentApi.middleware,
        )
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch

export default reduxStore