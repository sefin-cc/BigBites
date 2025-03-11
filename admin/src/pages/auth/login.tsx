import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom'; 

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();

    // Password visibility toggle functions
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    };

    const handleSubmit = () => {
        const newErrors: { [key: string]: string } = {};
    
        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Please enter a valid email address';
    
        // Validate password fields
        if (!password) newErrors.password = 'Password is required';
       
    
        setErrors(newErrors);
    
        // If no errors, proceed with form submission logic
        if (Object.keys(newErrors).length === 0) {
          console.log('Login!');
          console.log('Email:', email);
          console.log('Password:', password);
          navigate('/');
        }
      };

    return(
        <div className="flex flex-col justify-center items-center w-full h-screen" style={{backgroundColor: "#FB7F3B"}}>
            <img 
                src={logo} 
                style={{ 
                    width: 100, 
                    height: 100, 
                    objectFit: 'contain' 
                }} 
            />
            <p className=" text-3xl mb-3" style={{fontFamily: 'Madimi One', color: "white"}}>LOGIN</p>
            <div className="p-7 rounded-lg bg-white text-center" style={{width: '40%'}}>

                <div className="text-left">
                    <TextField
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.email}
                      />
                    {errors.email && <Typography color="error" variant="caption">{errors.email}</Typography>}

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
                                    onMouseUp={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                            label="Password"

                        />
                        {errors.password && <Typography color="error" variant="caption">{errors.password}</Typography>}
                    </FormControl>
                </div>
           <button
              onClick={handleSubmit}
              className="text text-white w-full"
              style={{ backgroundColor: '#2C2C2C', borderRadius: '4px', padding: '5px 20px', marginTop: 20 }}
            >
              LOGIN
            </button>
            </div>  
        </div>
    );
}