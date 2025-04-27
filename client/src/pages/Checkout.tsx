import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom"
import { removeCartItems } from "../redux/slices/cart.slice"
import { Grid2, TextField, Button, Typography, Card, CardContent, Radio, FormControlLabel, Divider, Box, FormControl, RadioGroup } from "@mui/material"
import { useAddOrderMutation } from "../redux/apis/order.api"
import { useDeleteAllCartItemsMutation } from "../redux/apis/cart.api"
import Toast from "../components/Toast"
import { useInitiatePaymentMutation, useVerifyPaymentMutation } from "../redux/apis/payment.api"

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid black',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'gray',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: 'gray',
    },
}

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>("cash")
    const { cartItems } = useSelector((state: RootState) => state.cart)
    const { user } = useSelector((state: RootState) => state.auth)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [placeOrder, { data: placeOrderData, isSuccess }] = useAddOrderMutation()
    const [deleteAllCartItems] = useDeleteAllCartItemsMutation()
    const [initiatePayment] = useInitiatePaymentMutation()
    const [verifyPayment] = useVerifyPaymentMutation()

    const orderSchema = z.object({
        fullName: z.string().min(1, "Full Name is required").max(50, "Full Name is too long"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string()
            .min(5, "Zip Code must be at least 5 characters")
            .max(10, "Zip Code must be at most 10 characters")
            .regex(/^\d+$/, "Zip Code must be numeric"),
    })

    type FormValues = z.infer<typeof orderSchema>

    const { register, handleSubmit, formState: { errors }, reset, getValues, trigger } = useForm<FormValues>({
        resolver: zodResolver(orderSchema),
        mode: "onChange",
        defaultValues: {
            fullName: "",
            address: "",
            city: "",
            state: "",
            zipCode: ""
        }
    })

    const [isAddressSaved, setIsAddressSaved] = useState(false)

    const handleReset = () => {
        reset()
        setIsAddressSaved(false)
    }

    const formValues = getValues()

    const handleSaveAddress = async () => {
        const isFormValid = await trigger()
        if (isFormValid) {
            const values = getValues()
            const isAddressFilled = Object.values(values).every((value) => value !== "")
            if (isAddressFilled) {
                setIsAddressSaved(true)
            }
        }
    }

    const handlePlaceOrder = async (values: FormValues) => {
        if (cartItems?.cartItemData.length) {
            const newOrderData = {
                shippingDetails: values,
                products: cartItems.cartItemData as any,
                totalAmount: cartItems.totalAmount,
            }

            if (paymentMethod === "cash") {
                placeOrder({ ...newOrderData, paymentMethod })
            } else if (paymentMethod === "online") {
                const productData = cartItems?.cartItemData.map((item) => {
                    return { productId: item.productId._id as string, quantity: item.quantity as number }
                })

                const response = await initiatePayment(productData).unwrap()

                const options: any = {
                    key: `${import.meta.env.VITE_RAZORPAY_API_KEY}`,
                    amount: response.amount,
                    currency: "INR",
                    name: "Purchase Product",
                    description: "Payment for purchasing product",
                    order_id: response.orderId,
                    handler: async function (paymentResponse: any) {
                        const verifyRes = await verifyPayment(paymentResponse).unwrap();

                        if (verifyRes.success) {
                            await placeOrder({ ...newOrderData, paymentMethod })
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone
                    },
                    theme: {
                        color: "#0F766E"
                    }
                };

                const razor = new (window as any).Razorpay(options);
                razor.open();
            }
        }
    }

    useEffect(() => {
        if (isSuccess) {
            const timeout = setTimeout(() => {
                navigate("/order/success")
                dispatch(removeCartItems())
                deleteAllCartItems()
            }, 2000)

            return () => clearTimeout(timeout)
        }
    }, [isSuccess])

    return <>
        {isSuccess && <Toast type="success" message={placeOrderData?.message as string} />}

        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" }, my: "32px" }}>
            <Typography variant="h4" fontWeight="bold" mb={6}>
                Checkout
            </Typography>

            <Grid2 container spacing={4}>
                {/* Shipping Form */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={2}>
                                Shipping Information
                            </Typography>

                            <Box component="form">
                                <Grid2 container spacing={2}>
                                    <Grid2 size={{ xs: 12 }}>
                                        <TextField
                                            sx={textFieldStyles}
                                            label="Full Name"
                                            fullWidth
                                            {...register("fullName")}
                                            error={!!errors.fullName}
                                            helperText={errors.fullName?.message}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12 }}>
                                        <TextField
                                            sx={textFieldStyles}
                                            label="Address"
                                            fullWidth
                                            {...register("address")}
                                            error={!!errors.address}
                                            helperText={errors.address?.message}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            sx={textFieldStyles}
                                            label="City"
                                            fullWidth
                                            {...register("city")}
                                            error={!!errors.city}
                                            helperText={errors.city?.message}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            sx={textFieldStyles}
                                            label="State"
                                            fullWidth
                                            {...register("state")}
                                            error={!!errors.state}
                                            helperText={errors.state?.message}
                                        />
                                    </Grid2>
                                    <Grid2 size={{ xs: 12 }}>
                                        <TextField
                                            sx={textFieldStyles}
                                            label="Zip Code"
                                            fullWidth
                                            {...register("zipCode")}
                                            error={!!errors.zipCode}
                                            helperText={errors.zipCode?.message}
                                        />
                                    </Grid2>

                                    {/* Save & Reset Buttons */}
                                    <Grid2 size={{ xs: 12 }} display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveAddress}
                                            sx={{ bgcolor: '#0F766E', color: "white", borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}

                                        >
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </Button>
                                    </Grid2>
                                </Grid2>

                                <Divider sx={{ my: 4 }} />

                                {/* Payment Option */}
                                <Typography variant="h6" mb={2}>
                                    Payment Option
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={paymentMethod}
                                        name="radio-buttons-group"
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <FormControlLabel value="cash" control={<Radio color="secondary" />} label="Cash on Delivery" />
                                        <FormControlLabel value="online" control={<Radio color="secondary" />} label="Online" />
                                    </RadioGroup>
                                </FormControl>

                                {/* Place Order Button */}
                                <Button
                                    onClick={handleSubmit(handlePlaceOrder)}
                                    type="submit"
                                    variant="contained"
                                    sx={{ mt: 4, bgcolor: '#0F766E', color: "white", borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}
                                    fullWidth
                                    disabled={!isAddressSaved}
                                >
                                    Place Order
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid2>

                {/* Order Summary */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={2}>
                                Order Summary
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Typography fontWeight="bold" mb={1}>
                                Shipping Information
                            </Typography>
                            <Typography variant="body2"><strong>Full Name:</strong> {formValues.fullName}</Typography>
                            <Typography variant="body2"><strong>Address:</strong> {formValues.address}</Typography>
                            <Typography variant="body2"><strong>City:</strong> {formValues.city}</Typography>
                            <Typography variant="body2"><strong>State:</strong> {formValues.state}</Typography>
                            <Typography variant="body2"><strong>Zip Code:</strong> {formValues.zipCode}</Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight="bold" mb={1}>
                                Payment Option
                            </Typography>
                            <Typography variant="body2">{paymentMethod === "cash" ? "Cash on Delivery" : "Online"}</Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography fontWeight="bold">
                                Total: ${cartItems?.totalAmount}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Box>
    </>
}

export default Checkout
