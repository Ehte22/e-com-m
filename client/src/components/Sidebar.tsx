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
import { RootState } from "../redux/store"
import { useSelector } from "react-redux"

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


const Sidebar = ({ open, setOpen }: { open: boolean, setOpen: (value: boolean) => void }) => {

    const location = useLocation()

    const { token } = useSelector((state: RootState) => state.auth)

    const theme = useTheme()
    const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"))

    const NAVIGATION = [
        {
            segment: '/',
            title: 'All',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
        {
            segment: '/clothes',
            title: 'Clothes',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
        {
            segment: '/electronics',
            title: 'Electronics',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
        {
            segment: '/toys',
            title: 'Toys',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
        {
            segment: '/furniture',
            title: 'Furniture',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
        {
            segment: '/orders',
            title: 'Orders',
            icon: <DashboardIcon sx={{ fontSize: "20px", color: "#0F766E" }} />,
        },
    ]

    return <>
        <CssBaseline />
        <Drawer sx={{ position: "fixed" }} variant="permanent" open={open}>
            <List>
                {NAVIGATION.map((item, index) => {
                    const isActive = location.pathname === item.segment || location.pathname.startsWith(item.segment + "/")

                    return <ListItem key={index} disablePadding sx={{ display: "block" }}>
                        {
                            item.title === "Orders" && token &&
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
                                    if (isXsScreen) {
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
                        }

                        {
                            item.title !== "Orders" &&
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
                                    if (isXsScreen) {
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
                        }
                    </ListItem>
                })}
            </List>
        </Drawer>
    </>
}

export default Sidebar
