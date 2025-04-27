import { lazy, useEffect } from 'react'
import { ImageContextProvider } from './context/ImageContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Protected from './components/Protected'
import { createTheme, ThemeProvider } from '@mui/material'
import { SearchProductProvider } from './context/searchProductContext'

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))
const Home = lazy(() => import('./pages/Home'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))
const AddProduct = lazy(() => import('./pages/product/AddProduct'))
const Products = lazy(() => import('./pages/product/Products'))
const Electronics = lazy(() => import('./pages/Electronics'))
const Toys = lazy(() => import('./pages/Toys'))
const Furniture = lazy(() => import('./pages/Furniture'))
const ProductDetails = lazy(() => import('./pages/product/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Profile = lazy(() => import('./pages/Profile'))
const Orders = lazy(() => import('./pages/Orders'))
const Users = lazy(() => import('./pages/Users'))
const AdminOrders = lazy(() => import('./pages/AdminOrders'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Clothes = lazy(() => import('./pages/Clothes'))

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FFFFFF", contrastText: "#000000" },
    secondary: { main: "#0F766E" },
  },
  breakpoints: { values: { xs: 0, sm: 600, md: 1000, lg: 1200, xl: 1536 } },
})

const App = () => {


  // It runs once on initial render, extracts the result (user info) and token from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const result = params.get('result')

    if (result) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(result))
        localStorage.setItem("user", JSON.stringify(parsedResult))
        localStorage.setItem("token", JSON.stringify(parsedResult.token))

        window.history.replaceState(null, "", window.location.pathname)

        window.location.reload()
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return <>
    <ThemeProvider theme={theme}>
      <SearchProductProvider>
        <ImageContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={
                  <ErrorBoundary>  <Home /></ErrorBoundary>}
                />
                <Route path="product/details/:id" element={
                  <ErrorBoundary>  <ProductDetails /></ErrorBoundary>}
                />
                <Route path="clothes" element={
                  <ErrorBoundary>  <Clothes /></ErrorBoundary>}
                />
                <Route path="electronics" element={
                  <ErrorBoundary>  <Electronics /></ErrorBoundary>}
                />
                <Route path="toys" element={
                  <ErrorBoundary>  <Toys /></ErrorBoundary>}
                />
                <Route path="furniture" element={
                  <ErrorBoundary>  <Furniture /></ErrorBoundary>}
                />
                <Route path="cart" element={
                  <ErrorBoundary>  <Cart /></ErrorBoundary>}
                />
                <Route path="checkout" element={
                  <ErrorBoundary>  <Checkout /></ErrorBoundary>}
                />
                <Route path="orders" element={
                  <ErrorBoundary>  <Orders /></ErrorBoundary>}
                />
                <Route path="order/success" element={
                  <ErrorBoundary>  <OrderSuccess /></ErrorBoundary>}
                />
                <Route path="profile/:id" element={
                  <ErrorBoundary>  <Profile /></ErrorBoundary>}
                />
              </Route>

              <Route path='/admin' element={<Protected roles={["Admin"]} compo={<AdminLayout />} />}>

                <Route index element={
                  <ErrorBoundary>  <Dashboard /></ErrorBoundary>}
                />

                <Route path='products'>
                  <Route index element={
                    <ErrorBoundary>  <Products /></ErrorBoundary>}
                  />
                  <Route path='add' element={
                    <ErrorBoundary>  <AddProduct /></ErrorBoundary>}
                  />
                  <Route path='update/:id' element={
                    <ErrorBoundary>  <AddProduct /></ErrorBoundary>}
                  />
                </Route>

                <Route path='users' element={
                  <ErrorBoundary>  <Users /></ErrorBoundary>}
                />

                <Route path="/admin/orders" element={
                  <ErrorBoundary>  <AdminOrders /></ErrorBoundary>}
                />

              </Route>

              <Route path='sign-in' element={
                <ErrorBoundary> <Login /></ErrorBoundary>}
              />

              <Route path='sign-up' element={
                <ErrorBoundary>  <Register /></ErrorBoundary>
              } />

              <Route path='forgot-password' element={
                <ErrorBoundary> <ForgotPassword /> </ErrorBoundary>
              } />

              <Route path='reset-password' element={
                <ErrorBoundary>  <ResetPassword /></ErrorBoundary>
              } />

              <Route path='unauthorized' element={
                <ErrorBoundary>  <Unauthorized /> </ErrorBoundary>
              } />

              <Route path='*' element={
                <ErrorBoundary>  <PageNotFound /> </ErrorBoundary>
              } />
            </Routes>
          </BrowserRouter >
        </ImageContextProvider>
      </SearchProductProvider>
    </ThemeProvider>
  </>
}

export default App