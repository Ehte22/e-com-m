import express from "express"
import * as orderController from "../controllers/order.controller"

const orderRoutes = express.Router()

orderRoutes
    .get("/", orderController.getAllOrders)
    .get("/:id", orderController.getOrderById)
    .post("/add", orderController.addOrder)
    .put("/status/:id", orderController.updateOrderStatus)
    .put("/cancel/:id", orderController.cancelOrder)
    .put("/return/:id", orderController.returnOrderRequest)

export default orderRoutes