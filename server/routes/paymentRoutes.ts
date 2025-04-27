import express from "express"
import * as paymentController from "../controllers/payment.controller"

const paymentRoutes = express.Router()

paymentRoutes
    .post("/initiate-payment", paymentController.initiatePayment)
    .post("/verify-payment", paymentController.verifyPayment)


export default paymentRoutes