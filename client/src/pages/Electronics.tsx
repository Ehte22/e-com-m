import { Box, Grid2, Typography } from '@mui/material'
import { useGetProductsQuery } from '../redux/apis/product.api'
import ProductCard from '../components/ProductCard'
import { useSearchProduct } from '../context/searchProductContext'
import { useDebounce } from '../utils/useDebounce'
import Loader from '../components/Loader'

const Electronics = () => {
    const { searchProduct } = useSearchProduct()
    const debounceSearchQuery = useDebounce(searchProduct, 500)

    const { data, isLoading } = useGetProductsQuery({
        isFetchAll: true,
        searchQuery: debounceSearchQuery.toLowerCase(),
        category: "Electronics"
    })

    if (isLoading) {
        return <Loader />
    }

    return <>
        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" } }}>
            <Grid2 container >
                {
                    data?.result.map((item) => {
                        return <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <ProductCard product={item} />
                        </Grid2>
                    })
                }
            </Grid2>
            {
                data?.result.length == 0 && <Typography variant='h6' sx={{ textAlign: "center" }}>No Electronics Found</Typography>
            }
        </Box>
    </>
}

export default Electronics