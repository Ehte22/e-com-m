import { useNavigate, useParams } from "react-router-dom"
import { Grid2, Card, CardMedia, Typography, Button, Stack, Box } from "@mui/material"
import { useGetProductByIdQuery } from "../../redux/apis/product.api"
import Loader from "../../components/Loader";
import { useAddCartItemMutation } from "../../redux/apis/cart.api";
import Toast from "../../components/Toast";

const ProductDetails = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const { id } = useParams()
    const { data: product, isLoading } = useGetProductByIdQuery(id || "", { skip: !id })
    const [addCartItem, { data: addData, isSuccess }] = useAddCartItemMutation()

    const handleAddCartItem = (product: any) => {
        token ? addCartItem({ productId: product._id }) : navigate("/auth")
    }

    if (isLoading) {
        return <Loader />
    }

    return <>
        {isSuccess && <Toast type="success" message={addData} />}

        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" }, my: "40px" }}>
            {product && (
                <Grid2 container spacing={6}>
                    {/* Product Image */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                height="400"
                                image={product.image}
                                alt={product.name}
                                sx={{ objectFit: "cover" }}
                            />
                        </Card>
                    </Grid2>

                    {/* Product Info */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            <Typography variant="h4" fontWeight="bold" >
                                {product.name}
                            </Typography>

                            <Typography sx={{ fontWeight: "bold", fontSize: 18 }} color="secondary">
                                ${product.price}
                            </Typography>

                            <Typography variant="body1">
                                {product.desc}
                            </Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    loading={isLoading}
                                    onClick={() => handleAddCartItem(product)}
                                    sx={{
                                        backgroundColor: "#0F766E",
                                        textTransform: "none",
                                        color: "white",
                                        "&:hover": { backgroundColor: "darkcyan" },
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <Typography variant="body2" color="text.secondary">
                                    In Stock
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid2>
                </Grid2>
            )}
        </Box>
    </>
}

export default ProductDetails
