import { useNavigate } from 'react-router-dom';
import { Button, Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const OrderSuccess = () => {
    const navigate = useNavigate();

    const handleGoToOrders = () => {
        navigate('/orders');
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100%" >
            <Card
                sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, boxShadow: 3, textAlign: 'center', }}
            >
                {/* Success Icon */}
                <Avatar sx={{ bgcolor: '#0F766E', mx: 'auto', mb: 3, }}>
                    <AiOutlineCheckCircle size={40} />
                </Avatar>

                <CardContent>
                    <Typography variant="h5" fontWeight="bold" color="#0F766E" gutterBottom>
                        Order Successful!
                    </Typography>

                    <Typography variant="body2" color="textSecondary" mb={4}>
                        Your order has been placed successfully. You can track your order details on the orders page.
                    </Typography>

                    {/* Go to Orders Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 2, bgcolor: '#0F766E', color: "white",
                            '&:hover': { bgcolor: 'darkcyan', },
                            fontWeight: 'bold', py: 1.5, borderRadius: 2, textTransform: "none"
                        }}
                        onClick={handleGoToOrders}
                    >
                        Go to Orders
                    </Button>
                </CardContent>
            </Card>
        </Box >
    );
};

export default OrderSuccess;
