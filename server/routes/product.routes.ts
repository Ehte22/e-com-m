import express from "express"
import * as productController from "../controllers/product.controller"
import multerMiddleware from "../utils/upload"
import { protectedRoute, restrict } from "../utils/protected"

const productRoutes = express.Router()
const upload = multerMiddleware()

productRoutes
    .get("/", productController.getAllProducts)
    .get("/:id", productController.getProductById)
    .post("/add", protectedRoute, restrict(["Admin"]), upload.single("image"), productController.addProduct)
    .put("/update/:id", protectedRoute, restrict(["Admin"]), upload.single("image"), productController.updateProduct)
    .put("/status/:id", protectedRoute, restrict(["Admin"]), productController.updateBrandStatus)
    .put("/delete/:id", protectedRoute, restrict(["Admin"]), productController.deleteProduct)

export default productRoutes