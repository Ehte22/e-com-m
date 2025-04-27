import { useEffect, useState } from 'react'
import { useDeleteCartItemMutation, useGetCartItemsQuery } from '../redux/apis/cart.api'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { ICart } from '../models/cart.interface'
import { Box, Button, Card, CardContent, Grid2, IconButton, Typography } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { setCartItem } from '../redux/slices/cart.slice'
import Toast from '../components/Toast'

const Cart = () => {
    const { data: cartData, isSuccess: isCartItemFetchSuccess, isLoading } = useGetCartItemsQuery({ isFetchAll: true })
    const [removeCartItem, { data: removeMessage, isSuccess: isRemoveSuccess }] = useDeleteCartItemMutation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state: RootState) => state.cart)
    const [cartAllItems, setCartAllItems] = useState<ICart[]>([])
    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [subTotalAmount, setSubTotalAmount] = useState<number>(0)
    const [tax, setTax] = useState<number>(0)

    const handleCheckout = () => {
        dispatch(setCartItem({ cartItemData: cartAllItems, totalAmount }))
        navigate(`/checkout`)
    }

    const handleQtyInc = (id: string) => {
        const updated = cartAllItems.map(item =>
            item._id === id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
        )
        setCartAllItems(updated)
    }

    const handleQtyDec = (id: string) => {
        const updated = cartAllItems.map(item =>
            item._id === id ? { ...item, quantity: (item.quantity || 0) - 1 } : item
        )
        setCartAllItems(updated)
    }

    useEffect(() => {
        if (cartAllItems.length > 0) {
            const subtotal = cartAllItems.reduce(
                (sum, item) => sum + +item?.productId.price * (item.quantity as number), 0)
            setSubTotalAmount(subtotal)
            const calculatedTax = subtotal * 18 / 100
            setTax(calculatedTax)
            setTotalAmount(subtotal + calculatedTax)
        }
    }, [cartAllItems])

    useEffect(() => {
        if (cartItems?.cartItemData) {
            setCartAllItems(cartItems.cartItemData)
        }
    }, [cartItems])

    useEffect(() => {
        if (isCartItemFetchSuccess) {
            setCartAllItems(cartData?.result)
        }
    }, [isCartItemFetchSuccess, cartData])

    if (isLoading) {
        return <Loader />
    }

    return <>
        {isRemoveSuccess && <Toast type="success" message={removeMessage} />}
        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" }, my: "32px" }}>
            <Typography variant="h4" fontWeight="bold" mb={4} color="text.primary">
                My Cart
            </Typography>

            {cartAllItems.length === 0 ? (
                <Typography variant="h5" textAlign="center" color="text.secondary">
                    Your cart is empty!
                </Typography>
            ) : (
                <Grid2 container spacing={4}>
                    <Grid2 size={{ xs: 12, lg: 8 }}>
                        <Grid2 container spacing={3}>
                            {cartAllItems.map((item) => (
                                <Grid2 size={{ xs: 12 }} key={item._id}>
                                    <Card sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                                        <Box
                                            component="img"
                                            src={item.productId.image}
                                            alt={item.productId.name}
                                            sx={{ width: 96, height: 96, borderRadius: 2, objectFit: 'cover' }}
                                        />

                                        <Box flex={1} ml={3}>
                                            <Typography variant="h6" fontWeight="bold" color="text.primary">
                                                {item.productId.name}
                                            </Typography>
                                            <Typography color="text.secondary" fontSize={18}>
                                                ${item.productId.price}
                                            </Typography>

                                            <Box display="flex" alignItems="center" mt={2}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQtyDec(item._id as string)}
                                                    disabled={item.quantity as number <= 1}
                                                    sx={{ bgcolor: '#0F766E', color: "white", borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography mx={2} fontWeight="medium" fontSize={18}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQtyInc(item._id as string)}
                                                    sx={{ bgcolor: '#0F766E', color: 'white', borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Box textAlign="right">
                                            <Typography fontWeight="bold" fontSize={18} color="text.primary">
                                                ${(+item.productId.price * (item.quantity as number)).toFixed(2)}
                                            </Typography>
                                            <Button
                                                onClick={() => removeCartItem(item._id as string)}
                                                sx={{ color: 'error.main', fontSize: 14, mt: 1 }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Grid2>

                    <Grid2 size={{ xs: 12, lg: 4 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h5" fontWeight="bold" mb={3}>
                                Order Summary
                            </Typography>

                            <CardContent sx={{ p: 0 }}>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography color="text.secondary" fontSize={18}>Subtotal</Typography>
                                    <Typography fontSize={18}>${subTotalAmount.toFixed(2)}</Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography color="text.secondary" fontSize={18}>Tax</Typography>
                                    <Typography fontSize={18}>${tax.toFixed(2)}</Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" fontWeight="bold" mt={2}>
                                    <Typography fontSize={20}>Total</Typography>
                                    <Typography fontSize={20}>${totalAmount.toFixed(2)}</Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 5, bgcolor: '#0F766E', color: "white", borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            )}
        </Box>
    </>
}

export default Cart
