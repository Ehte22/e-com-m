import { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper, Chip, } from '@mui/material'
import { useCancelOrderMutation, useGetOrdersQuery, useReturnOrderRequestedMutation } from '../redux/apis/order.api'
import Toast from '../components/Toast'

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

const Orders = () => {
    const { data } = useGetOrdersQuery({ isFetchAll: true })
    const [cancelOrder, { data: cancelOrderMessage, isSuccess }] = useCancelOrderMutation()
    const [returnOrder, { data: returnMessage, isSuccess: isReturnRequestSuccess }] = useReturnOrderRequestedMutation()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [returnReason, setReturnReason] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>()
    const [selectedOrderId, setSelectedProductId] = useState<string>()

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const handleCancelOrder = (id: string) => {
        cancelOrder(id)
    }

    const handleReturnOrder = () => {
        if (selectedOrderId && returnReason?.length >= 5) {
            const returnOrderData = { id: selectedOrderId, returnReason }
            returnOrder(returnOrderData)

            setErrorMessage('')
            setIsModalOpen(false)
        } else {
            setErrorMessage('Please enter return order reason.')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'warning'
            case 'Shipped':
                return 'primary'
            case 'Delivered':
                return 'success'
            case 'Cancelled':
                return 'error'
            default:
                return 'default'
        }
    }

    return <>
        {isSuccess && <Toast type="success" message={cancelOrderMessage as string} />}
        {isReturnRequestSuccess && <Toast type="success" message={returnMessage as string} />}
        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" }, my: "32px" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>

            {data?.result.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 10 }}>
                    No Order Found
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Product</strong></TableCell>
                                <TableCell><strong>Price</strong></TableCell>
                                <TableCell><strong>Quantity</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.result.map((order) => (
                                <TableRow key={order._id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                            {order.products.map((item) => (
                                                <Box key={item._id}>
                                                    <img
                                                        src={item.productId?.image as string}
                                                        alt={item.productId?.name}
                                                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    </TableCell>

                                    <TableCell>
                                        {order.products.map((item) => (
                                            <Typography key={item._id} variant="body2" sx={{ mb: 1 }}>
                                                ${item.productId?.price}
                                            </Typography>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        {order.products.map((item) => (
                                            <Typography key={item._id} variant="body2" sx={{ mb: 1 }}>
                                                {item.quantity}
                                            </Typography>
                                        ))}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status as string)}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {order.returnStatus === 'Pending' ? (
                                            <Typography variant="body2" color="warning.main">
                                                Return in Progress
                                            </Typography>
                                        ) : order.status === 'Pending' ? (
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleCancelOrder(order._id as string)}
                                            >
                                                Cancel Order
                                            </Button>
                                        ) : order.status === 'Delivered' ? (
                                            <Button
                                                size="small"
                                                sx={{ color: "blue" }}
                                                onClick={() => {
                                                    setIsModalOpen(true)
                                                    setSelectedProductId(order._id)
                                                }}
                                            >
                                                Return Order
                                            </Button>
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">
                                                No Action Available
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Return Order Modal */}
            <Dialog open={isModalOpen} onClose={toggleModal} fullWidth maxWidth="sm">
                <DialogTitle>Return Order Request</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Reason"
                        placeholder="Type here"
                        multiline
                        rows={4}
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        error={!!errorMessage}
                        helperText={errorMessage}
                        sx={{ ...textFieldStyles, mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleModal} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleReturnOrder} variant="contained" sx={{ bgcolor: '#0F766E', color: "white", borderRadius: 1, "&:hover": { backgroundColor: "darkcyan" } }}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    </>
}

export default Orders
