import React from 'react'
import { IProduct } from '../models/product.interface'
import { useNavigate } from 'react-router-dom'
import { Card, CardMedia, CardContent, Typography, Button, Box, CardActions, Chip } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAddCartItemMutation } from '../redux/apis/cart.api';
import Toast from './Toast';

interface IProductCardProps {
    product: IProduct
}

const ProductCard: React.FC<IProductCardProps> = ({ product }) => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()

    const [addCartItem, { data: addData, isSuccess }] = useAddCartItemMutation()

    const handleAddCartItem = (product: any) => {
        token ? addCartItem({ productId: product._id }) : navigate("/sign-in")
    }

    return <>
        {isSuccess && <Toast type="success" message={addData} />}

        <Box width="100%" p={2} >
            <Card sx={{ '&:hover': { boxShadow: 2 } }}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="220"
                        image={product.image}
                        alt={product.name}
                        sx={{
                            objectFit: 'cover',
                        }}
                    />
                    <Chip
                        label={product.category}
                        size="small"
                        sx={{
                            borderRadius: 3,
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            backgroundColor: "rgba(255, 254, 255, 0.7)",
                            px: 1,
                        }}
                    />
                </Box>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" gap={2} height={28} alignItems="center" mb={1}>
                        <Typography>
                            {product.name}
                        </Typography>
                        <Typography variant="subtitle1" color="#0F766E">
                            ${product.price}
                        </Typography>
                    </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/product/details/${product._id}`)}
                        sx={{
                            backgroundColor: '#0F766E',
                            color: "white",
                            '&:hover': { backgroundColor: 'darkcyan' },
                            textTransform: 'none',
                        }}
                    >
                        View Product
                    </Button>

                    <Button
                        onClick={() => handleAddCartItem(product)}
                        sx={{
                            backgroundColor: '#0F766E',
                            color: 'white',
                            '&:hover': { backgroundColor: 'darkcyan' },
                        }}
                    >
                        <AddShoppingCartIcon />
                    </Button>
                </CardActions>
            </Card>
        </Box >
    </>
}

export default ProductCard
