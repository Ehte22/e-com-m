import { Avatar, Box, Chip, Paper, Stack } from '@mui/material';
import DataContainer, { DataContainerConfig } from '../components/DataContainer'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDebounce } from '../utils/useDebounce';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import { IUser } from '../models/user.interface';
import { useGetUsersQuery, useUpdateUserStatusMutation } from '../redux/apis/user.api';

const Users = () => {
    const [searchQuery, setSearchQuery] = useState<string>("")

    const config: DataContainerConfig = {
        pageTitle: "Users",
        showAddBtn: true,
        showRefreshButton: true,
        showSearchBar: true,
        onSearch: setSearchQuery,
    }

    const [users, setUsers] = useState<IUser[]>([])
    const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 0, pageSize: 10 })
    const debounceSearchQuery = useDebounce(searchQuery, 500)

    const { data, isLoading } = useGetUsersQuery({
        page: pagination.page + 1,
        limit: pagination.pageSize,
        searchQuery: debounceSearchQuery.toLowerCase(),
    })
    const [updateStatus, { data: message, isSuccess }] = useUpdateUserStatusMutation()

    const columns: GridColDef[] = [
        { field: 'serialNo', headerName: 'Sr. No.', minWidth: 70, flex: 0.4 },
        { field: 'name', headerName: 'Name', minWidth: 200, flex: 1 },
        { field: 'email', headerName: 'Email', minWidth: 300, flex: 1 },
        { field: 'phone', headerName: 'Phone', minWidth: 170, flex: 0.7 },
        {
            field: 'image',
            headerName: 'Image',
            minWidth: 100,
            flex: 0.7,
            sortable: false,

            renderCell: (params) => (
                <Box
                    sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', }}
                >
                    <Avatar
                        src={params.value}
                        alt="Product Image"
                        variant="rounded"
                        sx={{ width: 40, height: 40, border: '1px solid grey' }}
                    />
                </Box>
            )

        },
        {
            field: 'status', headerName: 'Status', minWidth: 150, flex: 0.8,
            renderCell: (params) => {
                const handleStatusChange = () => {
                    updateStatus({ id: params.row._id, status: params.value === "active" ? "inactive" : "active" })
                };
                return <>
                    <Stack direction="row" sx={{ height: "100%", display: "flex", alignItems: "center" }} >
                        <Chip
                            label={params.value === "active" ? "Active" : "Inactive"}
                            color={params.value === "active" ? "success" : "error"}
                            variant="outlined"
                            onClick={handleStatusChange}
                            sx={{ borderRadius: 1 }} />
                    </Stack>
                </>
            }
        },
    ];

    useEffect(() => {
        if (data?.result) {
            const x = data.result.map((item, index) => {
                return { ...item, serialNo: index + 1 }
            })
            setUsers(x)
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
                rows={users}
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

export default Users