import { Box, Grid2 } from '@mui/material'
import { useGetProductsQuery } from '../redux/apis/product.api'
import ProductCard from '../components/ProductCard'
import { useSearchProduct } from '../context/searchProductContext'
import { useDebounce } from '../utils/useDebounce'

const Home = () => {
    const { searchProduct } = useSearchProduct()
    const debounceSearchQuery = useDebounce(searchProduct, 500)

    const { data } = useGetProductsQuery({
        isFetchAll: true,
        searchQuery: debounceSearchQuery.toLowerCase(),
        category: "all"
    })
    return <>
        <Box sx={{ mx: { xs: "32px", sm: "8px", md: "40px", lg: "60px" } }}>
            <Grid2 container >
                {
                    data?.result.map((item) => {
                        return <Grid2 key={item._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <ProductCard product={item} />
                        </Grid2>
                    })
                }
            </Grid2>
        </Box>
    </>
}

export default Home