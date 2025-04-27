import express from "express"
import * as cartController from "../controllers/cart.controller"

const cartRoutes = express.Router()

cartRoutes
    .get("/", cartController.getAllCartItems)
    .get("/:id", cartController.getCartItemById)
    .post("/add", cartController.addCartItem)
    .put("/delete/:id", cartController.deleteCartItem)
    .put("/delete-all", cartController.deleteAllCartItems)

export default cartRoutes