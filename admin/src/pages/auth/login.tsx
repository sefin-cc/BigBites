import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress"; // ✅ Loading spinner
import { useState } from "react";
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authApi';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../features/auth/authSlice';
import ReactLoading from "react-loading";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [login, { isLoading }] = useLoginMutation();

    // Toggle Password Visibility
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // Handle Login Submission
    const handleSubmit = async () => {
        setErrors({}); // Clear previous errors

        const newErrors: { [key: string]: string } = {};

        // Validate Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';

        // Validate Password
        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await login({ email, password }).unwrap(); 
                dispatch(setAdmin(response.admin));
                navigate('/'); // Redirect after successful login

            } catch (err: any) {
                if (err.data?.errors) {
                    setErrors(err.data.errors); 
                } else if (err.data?.error) {
                    setErrors({ general: err.data.error }); 
                } else {
                    setErrors({ general: "An unexpected error occurred. Please try again." });
                }
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-screen" style={{ backgroundColor: "#FB7F3B" }}>
            <img
                src={logo}
                style={{
                    width: 100,
                    height: 100,
                    objectFit: 'contain'
                }}
                alt="Logo"
            />
            <p className="text-3xl mb-3" style={{ fontFamily: 'Madimi One', color: "white" }}>LOGIN</p>
            <div className="p-7 rounded-lg bg-white text-center" style={{ width: '40%' }}>

                <div className="text-left">
                    {/* Email Input */}
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    {/* Password Input */}
                    <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined" required error={!!errors.password}>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    {errors.password && <Typography color="error" variant="caption">{errors.password}</Typography>}
                    {/* Display API Error */}
                    {errors.general && <Typography color="error" variant="caption" >{errors.general}</Typography>}

                </div>

               
                {/* Login Button with Loading State */}
                <button
                    onClick={handleSubmit}
                    className="text-white w-full"
                    style={{
                        backgroundColor: '#2C2C2C',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        marginTop: 20,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    disabled={isLoading} // ✅ Disable button while logging in
                >
                    {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} />: "LOGIN"}
                </button>
            </div>
        </div>
    );
}
