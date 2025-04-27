import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountMenu from './AccountMenu';
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Box, TextField, useMediaQuery, useTheme } from '@mui/material';
import { useGetCartItemsQuery } from '../redux/apis/cart.api';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchProduct } from '../context/searchProductContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface INavbarProps {
    open: boolean
    toggleSideBar: () => void
}

const Navbar: React.FC<INavbarProps> = ({ open, toggleSideBar }) => {
    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"))

    const { setSearchProduct } = useSearchProduct()

    const { token } = useSelector((state: RootState) => state.auth)

    const { data } = useGetCartItemsQuery({ isFetchAll: true })

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchProduct(event.target.value)
    };

    return <>
        <AppBar position="fixed" sx={{ height: "64px", width: "100%", boxShadow: "none", borderBottom: "1px solid lightgray", px: { sm: "8px", md: "40px", lg: "60px" } }}>
            <Toolbar>
                {!isMediumScreen && <IconButton
                    onClick={toggleSideBar}
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Typography variant="h6" component="div"  >
                            Shoppi
                        </Typography>
                        {
                            isMediumScreen && <Box sx={{ display: "flex", gap: 3 }}>
                                <Link to="/" style={{ textDecoration: "none", color: "black" }}>All</Link>
                                <Link to="/clothes" style={{ textDecoration: "none", color: "black" }}>Clothes</Link>
                                <Link to="/electronics" style={{ textDecoration: "none", color: "black" }}>Electronics</Link>
                                <Link to="/toys" style={{ textDecoration: "none", color: "black" }}>Toys</Link>
                                <Link to="/furniture" style={{ textDecoration: "none", color: "black" }}>Furniture</Link>
                                {token && <Link to="/orders" style={{ textDecoration: "none", color: "black" }}>Orders</Link>}
                            </Box>
                        }
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                        {/* Search Input */}
                        <TextField
                            id="search"
                            label="Search product"
                            variant="outlined"
                            size="small"
                            onChange={handleSearchChange}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton type="button" aria-label="search" size="small">
                                            <SearchIcon />
                                        </IconButton>
                                    ),
                                    sx: { pr: 0.5 },
                                },
                            }}
                            sx={{
                                mr: { sm: 1 },
                                width: { xs: "100%", sm: "280px" },
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        border: '1px solid black',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'gray',
                                    },
                                    '& .MuiInputBase-root': {
                                        color: 'black',
                                    },
                                    '& input:-webkit-autofill': {
                                        WebkitBoxShadow: '0 0 0 100px black inset',
                                        WebkitTextFillColor: 'black',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'gray',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'black',
                                },
                            }}
                        />

                        {/* Cart Button */}
                        <IconButton
                            component={Link}
                            to="/cart"
                            sx={{
                                color: "white",
                                "&:hover": { color: "gray.200" },
                                fontSize: 28,
                                position: "relative",
                            }}
                        >
                            <Badge
                                badgeContent={data?.result.length || "0"}
                                color="error"
                                overlap="circular"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        right: 6,
                                        top: 6,
                                        width: 20,
                                        height: 20,
                                        fontSize: 12,
                                        fontWeight: "bold",
                                    },
                                }}
                            >
                                <ShoppingCartIcon sx={{ color: 'black' }} fontSize={"100" as any} />
                            </Badge>
                        </IconButton>
                        <AccountMenu />
                    </Box>
                </Box>
            </Toolbar >
        </AppBar >
    </>
}

export default Navbar
