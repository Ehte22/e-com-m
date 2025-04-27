import { Box, useMediaQuery, Drawer } from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const drawerWidth = 320;
const navbarHeight = 64;

const Layout = () => {
    const theme = useTheme();
    const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", }}>
            <Box
                sx={{ zIndex: theme.zIndex.drawer + 1, }}
            >
                <Navbar open={open} toggleSideBar={() => setOpen(!open)} />
            </Box>

            {isMdScreen && (
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Sidebar open={open} setOpen={setOpen} />
                </Drawer>
            )
            }

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginTop: `${navbarHeight}px`,
                    px: { xs: "12px", sm: "16px", md: "28px" },
                    py: "40px",
                    marginLeft: 0,
                    transition: theme.transitions.create(["margin-left", "width"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Outlet />
            </Box>
        </Box >
    );
};

export default Layout;
