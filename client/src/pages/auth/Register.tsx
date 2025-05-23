import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldConfig } from '../../hooks/useDynamicForm';
import { customValidator } from '../../utils/validator';
import { useSignUpMutation } from '../../redux/apis/auth.api';
import { IUser } from '../../models/user.interface';
import Toast from '../../components/Toast';

const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        height: "44px",
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #0F766E',
        },
        '& .MuiInputBase-root': {
            color: '#0F766E',
        },
        '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #f6fffb inset',
            WebkitTextFillColor: '#000',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'gray',
        transform: 'translate(14px, 11px) scale(1)',
        '&.Mui-focused, &.MuiFormLabel-filled': {
            transform: 'translate(14px, -6px) scale(0.75)',
        },
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#0F766E',
    },
};

const fields: FieldConfig[] = [
    {
        name: "name",
        label: "Name",
        type: "text",
        rules: { required: true }
    },
    {
        name: "email",
        label: "Email Address",
        type: "text",
        rules: { required: true, email: true }
    },
    {
        name: "phone",
        label: "Phone Number",
        type: "text",
        rules: { required: true, pattern: /^[6-9]\d{9}$/, patternMessage: "Please enter a valid phone number" }
    },
    {
        name: "password",
        label: "Password",
        type: "text",
        rules: { required: true, min: 8, max: 16 }
    },
    {
        name: "confirmPassword",
        label: "Confirm Password",
        placeholder: "Confirm Password",
        type: "text",
        rules: { required: true }
    },
    {
        name: "referrer",
        placeholder: "Referral Code",
        type: "text",
        rules: { required: false }
    },
]


const Register = () => {
    const [signUp, { data, error, isSuccess, isLoading, isError }] = useSignUpMutation()

    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({
        password: false,
        cpassword: false
    });
    const [isPassMatchError, setIsPassMatchError] = useState<boolean>(false)

    const defaultValues = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    }

    const navigate = useNavigate()

    const handleClickShowPassword = (field: string) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const schema = customValidator(fields)

    type FormValues = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues })

    const onSubmit = (values: FormValues) => {
        if (!isPassMatchError) {
            signUp(values as IUser)
        }
    }

    useEffect(() => {
        const subscription = watch((values) => {
            if (values.password && values.password !== values.confirmPassword) {
                setIsPassMatchError(true);
            } else {
                setIsPassMatchError(false)
            }
        });

        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (isSuccess) {
            const timeout = setTimeout(() => {
                navigate("/sign-in")
            }, 2000);
            return () => clearTimeout(timeout)
        }
    }, [isSuccess, navigate])

    return <>
        {isSuccess && <Toast type='success' message={data.message} />}
        {isError && <Toast type='error' message={error as string} />}
        <Container
            component="main"
            maxWidth={false}
            sx={{ minHeight: "100vh", maxWidth: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: "100%", textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>

                    {/* Name  */}
                    <TextField
                        {...register("name")}
                        fullWidth
                        label="Name"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        sx={textFieldStyles}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                    />

                    {/* Email Address */}
                    <TextField
                        {...register("email")}
                        fullWidth
                        label="Email Address"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        sx={textFieldStyles}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                    />

                    {/* Phone Number */}
                    <TextField
                        {...register("phone")}
                        fullWidth
                        label="Phone Number"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        sx={textFieldStyles}
                        error={!!errors.phone}
                        helperText={errors.phone?.message as string}
                    />

                    {/* Password */}
                    <FormControl fullWidth margin="normal" variant="outlined" sx={textFieldStyles} error={!!errors.password} >
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            {...register("password")}
                            id="outlined-adornment-password"
                            type={showPassword.password ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword.password ? 'hide the password' : 'display the password'
                                        }
                                        onClick={() => handleClickShowPassword("password")}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword.password ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                        <Typography variant="caption" color="error"
                            sx={{ textAlign: "left", display: "block", marginTop: "2px", marginLeft: "16px" }}>
                            {errors.password?.message as string}
                        </Typography>
                    </FormControl>

                    {/* Confirm Password */}
                    <FormControl fullWidth margin="normal" variant="outlined" sx={textFieldStyles} error={isPassMatchError && watch("confirmPassword") !== ""}>
                        <InputLabel htmlFor="outlined-adornment-cpassword">Confirm Password</InputLabel>
                        <OutlinedInput
                            {...register("confirmPassword")}
                            id="outlined-adornment-cpassword"
                            type={showPassword.cpassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword.cpassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={() => handleClickShowPassword("cpassword")}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword.cpassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                        {isPassMatchError && watch("confirmPassword") !== "" && (
                            <Typography variant="caption" color="error"
                                sx={{ textAlign: "left", display: "block", marginTop: "2px", marginLeft: "16px" }}>
                                Passwords do not match
                            </Typography>
                        )}
                        <Typography variant="caption" color="error"
                            sx={{ textAlign: "left", display: "block", marginTop: "2px", marginLeft: "16px" }}>
                            {errors.confirmPassword?.message as string}
                        </Typography>
                    </FormControl>

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        loading={isLoading}
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, backgroundColor: "#0F766E", color: "white" }}
                    >
                        Sign Up
                    </Button>

                </Box>

                {/* Register Link */}
                <Typography variant="body2" mt={3}>
                    Already have an account?{" "}
                    <Link to="/sign-in" style={{ color: "#0F766E", textDecoration: "none" }}>
                        Sign In here
                    </Link>
                </Typography>
            </Paper>
        </Container>
    </>
}

export default Register