import { Avatar, Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import DataContainer, { DataContainerConfig } from '../components/DataContainer'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { useDebounce } from '../utils/useDebounce'
import Toast from '../components/Toast'
import Loader from '../components/Loader'
import { IOrder } from '../models/order.interface'
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../redux/apis/order.api'

const AdminOrders = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")

    const config: DataContainerConfig = {
        pageTitle: "Orders",
        showAddBtn: true,
        showRefreshButton: true,
        showSearchBar: true,
        onSearch: setSearchQuery,
    }

    const [orders, setOrders] = useState<IOrder[]>([])
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 0, pageSize: 10 })
    const debounceSearchQuery = useDebounce(searchQuery, 500)

    const { data, isLoading } = useGetOrdersQuery({
        page: pagination.page + 1,
        limit: pagination.pageSize,
        searchQuery: debounceSearchQuery.toLowerCase(),
    })
    const [updateStatus, { data: message, isSuccess }] = useUpdateOrderStatusMutation()

    const columns: GridColDef[] = [
        { field: 'serialNo', headerName: 'Sr. No.', minWidth: 70, flex: 0.4 },
        { field: '_id', headerName: 'Order Id', minWidth: 220, flex: 1 },
        {
            field: 'productsNames',
            headerName: 'Products',
            minWidth: 220,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const products = params.row.products
                return <>
                    <Box>
                        {products.map((item: any, index: number) => (
                            <Typography key={index} sx={{ mr: 1 }} component="span">
                                {item.productId?.name},
                            </Typography>
                        ))}
                    </Box>
                </>
            }
        },

        {
            field: 'productImages',
            headerName: 'Images',
            minWidth: 220,
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                const products = params.row.products
                return <>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {products.map((item: any, index: number) => (
                            <Avatar
                                key={index}
                                src={item.productId?.image}
                                alt="Product"
                                variant="rounded"
                                sx={{ width: 40, height: 40, border: '1px solid #ddd' }}
                            />
                        ))}
                    </Box>
                </>
            }
        },
        {
            field: 'status', headerName: 'Status', minWidth: 120, flex: 0.7,
            sortable: false,
            renderCell: (params) => {
                return <>
                    <Stack direction="row" sx={{ height: "100%", display: "flex", alignItems: "center" }} >
                        <Chip
                            size='small'
                            label={params.value}
                            variant="filled"
                            sx={{
                                borderRadius: 1, color: "white", backgroundColor: params.value === "Pending"
                                    ? "#fcba03"
                                    : params.value === "Shipped"
                                        ? "#4370f7"
                                        : params.value === "Delivered"
                                            ? "#00c979"
                                            : params.value === "Cancelled"
                                                ? "red"
                                                : "gray"
                            }} />
                    </Stack>
                </>
            }
        },
        {
            field: 'actions', headerName: 'Action', minWidth: 150, flex: 0.8,
            sortable: false,
            renderCell: (params) => {
                const handleUpdateStatus = (status: string, returnStatus: string | null) => {
                    updateStatus({ id: params.row._id, status, returnStatus })
                }
                return <>
                    {
                        params.row.status === "Pending"
                            ? <Button
                                size="small"
                                sx={{ color: "blue" }}
                                onClick={() => handleUpdateStatus("Shipped", null)}
                            >
                                Mark as Shipped
                            </Button>
                            : params.row.status === "Shipped"
                                ? <Button
                                    size="small"
                                    sx={{ color: "#00c979" }}
                                    onClick={() => handleUpdateStatus("Delivered", null)}
                                >
                                    Mark as Delivered
                                </Button>
                                : params.row.status === "Delivered"
                                    ? <Button
                                        size="small"
                                        color='secondary'
                                        onClick={() => handleUpdateStatus("Returned", "Completed")}
                                    >
                                        Complete Return
                                    </Button>
                                    : "No Action Available"
                    }
                </>
            }
        },

    ]

    useEffect(() => {
        if (data?.result) {
            const x = data.result.map((item, index) => {
                return { ...item, serialNo: index + 1 }
            })
            setOrders(x)
        }
    }, [data?.result])

    if (isLoading) {
        return <Loader />
    }

    return <>
        {isSuccess && <Toast type='success' message={message as string} />}
        <DataContainer config={config} />
        <Paper sx={{ width: '100%', mt: 2 }}>
            <DataGrid
                rows={orders}
                columns={columns}
                loading={isLoading}
                rowCount={data?.pagination.totalEntries || 0}
                paginationMode='server'
                pageSizeOptions={[5, 10, 20, 50]}
                paginationModel={{ page: pagination.page, pageSize: pagination.pageSize }}
                getRowId={(row) => row._id}
                onPaginationModelChange={(params) => {
                    setPagination({ page: params.page, pageSize: params.pageSize })
                }}
                sx={{ border: 0 }}
            />
        </Paper >
    </>
}

export default AdminOrders