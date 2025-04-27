import { Box, Button, Divider, Grid2, Paper } from '@mui/material'
import DataContainer, { DataContainerConfig } from '../../components/DataContainer'
import useDynamicForm, { FieldConfig } from '../../hooks/useDynamicForm'
import { customValidator } from '../../utils/validator'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useImagePreview } from '../../context/ImageContext'
import Toast from '../../components/Toast'
import { useAddProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '../../redux/apis/product.api'

const AddProduct = () => {
    const { id } = useParams()
    const { setPreviewImages } = useImagePreview()
    const navigate = useNavigate()

    const [addProduct, { data: addData, error: addError, isLoading: addLoading, isSuccess: isAddSuccess, isError: isAddError }] = useAddProductMutation()
    const [updateProduct, { data: updateData, error: updateError, isLoading: updateLoading, isSuccess: isUpdateSuccess, isError: isUpdateError }] = useUpdateProductMutation()
    const { data } = useGetProductByIdQuery(id as string, { skip: !id })

    const config: DataContainerConfig = {
        pageTitle: id ? "Edit Product" : "Add Product",
        backLink: "../",
    }

    const fields: FieldConfig[] = [
        {
            name: "name",
            type: "text",
            placeholder: "Name",
            rules: { required: true, min: 2, max: 100 }
        },
        {
            name: "price",
            type: "text",
            placeholder: "Price",
            rules: { required: true, pattern: /^\d+$/, patternMessage: "Only numbers are allowed" }
        },
        {
            name: "category",
            type: "text",
            placeholder: "Category",
            rules: { required: true, min: 2, max: 100 }
        },
        {
            name: "desc",
            type: "textarea",
            placeholder: "Description",
            rules: { required: false, min: 2, max: 500 }
        },
        {
            name: "image",
            type: "file",
            label: "Image",
            placeholder: "Image",
            rules: { required: data?.image ? false : true, file: true }
        },
    ]

    const defaultValues = {
        name: "",
        price: "",
        category: "",
        desc: "",
        image: ""
    }

    const schema = customValidator(fields)

    type FormValues = z.infer<typeof schema>

    const onSubmit = (values: FormValues) => {
        const formData = new FormData()

        Object.keys(values).forEach((key) => {
            if (typeof values[key] === "object") {
                Object.keys(values[key]).forEach((item) => {
                    formData.append(key, values[key][item])
                })
            } else {
                formData.append(key, values[key])
            }
        })

        if (id && data) {
            updateProduct({ id, productData: formData })
        } else {
            addProduct(formData)
        }
    }

    const handleReset = () => {
        reset()
        setPreviewImages([])
    }

    const { handleSubmit, renderSingleInput, setValue, reset } = useDynamicForm({ fields, defaultValues, schema, onSubmit })

    useEffect(() => {
        if (id && data) {
            setValue("name", data.name)
            setValue("desc", data.desc)
            setValue("category", data.category)
            setValue("price", data.price.toString() || "")

            if (data.image) {
                setValue("image", data.image)
                setPreviewImages([data.image])
            }
        }
    }, [id, data])

    useEffect(() => {
        if (isAddSuccess) {
            const timeout = setTimeout(() => {
                navigate("/admin/products")
            }, 2000);
            return () => clearTimeout(timeout)
        }
    }, [isAddSuccess])

    useEffect(() => {
        if (isUpdateSuccess) {
            setTimeout(() => {
                navigate("/admin/products")
            }, 2000);
        }
    }, [isUpdateSuccess])


    return <>
        {isAddSuccess && <Toast type="success" message={addData?.message} />}
        {isAddError && <Toast type="error" message={addError as string} />}

        {isUpdateSuccess && <Toast type={updateData === "No Changes Detected" ? "info" : "success"} message={updateData as string} />}
        {isUpdateError && <Toast type="error" message={updateError as string} />}

        <Box>
            <DataContainer config={config} />
            <Paper sx={{ mt: 2, pt: 4, pb: 3 }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid2 container columnSpacing={2} rowSpacing={3} sx={{ px: 3 }} >

                        {/* Name */}
                        <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
                            {renderSingleInput("name")}
                        </Grid2>

                        {/* Price */}
                        <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
                            {renderSingleInput("price")}
                        </Grid2>

                        {/* Category */}
                        <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
                            {renderSingleInput("category")}
                        </Grid2>

                        {/* Description */}
                        <Grid2 size={{ xs: 12, md: 6 }} >
                            {renderSingleInput("desc")}
                        </Grid2>

                        {/* Logo */}
                        <Grid2 size={{ xs: 12 }}>
                            {renderSingleInput("image")}
                        </Grid2>

                    </Grid2>

                    <Divider sx={{ mt: 4, mb: 3 }} />

                    <Box sx={{ textAlign: "end", px: 3 }}>
                        <Button
                            type='button'
                            onClick={handleReset}
                            variant='contained'
                            sx={{ backgroundColor: "#F3F3F3", py: 0.65 }}>
                            Reset
                        </Button>
                        <Button
                            loading={id ? updateLoading : addLoading}
                            type='submit'
                            variant='contained'
                            sx={{ ml: 2, background: "#0F766E", color: "white", py: 0.65 }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    </>
}

export default AddProduct