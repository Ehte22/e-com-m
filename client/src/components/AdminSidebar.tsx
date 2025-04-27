import { styled, Theme, CSSObject, useTheme } from "@mui/material/styles"
import MuiDrawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { CssBaseline, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { Link, useLocation } from "react-router-dom"
import DashboardIcon from '@mui/icons-material/Dashboard'
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"

const drawerWidth = 320
const navbarHeight = 64

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        height: `calc(100vh - ${navbarHeight}px)`,
        top: navbarHeight,
        boxSizing: "border-box",
        position: "absolute",
        ...(open ? openedMixin(theme) : closedMixin(theme)),
        "& .MuiDrawer-paper": {
            position: "absolute",
            ...(open ? openedMixin(theme) : closedMixin(theme)),
        },
    })
)


const AdminSidebar = ({ open, setOpen }: { open: boolean, setOpen: (value: boolean) => void }) => {

    const location = useLocation()

    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

    const { user } = useSelector((state: RootState) => state.auth)

    const NAVIGATION = [
        {
            segment: '/admin',
            title: 'Dashboard',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
            roles: ["Admin"]
        },
        {
            segment: '/admin/users',
            title: 'Users',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
            roles: ["Admin"]
        },
        {
            segment: '/admin/products',
            title: 'Products',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
            roles: ["Admin"]
        },
        {
            segment: '/admin/orders',
            title: 'Orders',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
            roles: ["Admin"]
        },
    ]

    const filteredNavigation = NAVIGATION.filter(item =>
        Array.isArray(user?.role) ? item.roles.some(role => user.role.includes(role)) : item.roles.includes(user?.role as string)
    );


    return <>
        <CssBaseline />
        <Drawer sx={{ position: "fixed" }} variant="permanent" open={open}>
            <List>
                {filteredNavigation.map((item, index) => {
                    const isActive = location.pathname === item.segment || location.pathname.startsWith(item.segment + "/admin")

                    return <ListItem key={index} disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            component={Link}
                            to={item.segment}
                            sx={{
                                minHeight: 48,
                                px: 2.5,
                                justifyContent: open ? "initial" : "center",
                                backgroundColor: isActive ? "#f0f0f0" : "transparent",

                            }}
                            onClick={() => {
                                if (isSmallScreen) {
                                    setOpen(false)
                                }
                            }}
                        >
                            <Tooltip title={item.title}>
                                <ListItemIcon
                                    sx={{ minWidth: 0, justifyContent: "center", mr: open ? 3 : "auto" }}>
                                    {item.icon}
                                </ListItemIcon>
                            </Tooltip>
                            <ListItemText
                                primary={
                                    <Typography variant="body1" fontWeight={500}>
                                        {item.title}
                                    </Typography>
                                }
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                })}
            </List>
        </Drawer>
    </>
}

export default AdminSidebar
