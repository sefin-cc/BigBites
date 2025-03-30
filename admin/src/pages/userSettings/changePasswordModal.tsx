import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useUpdatePasswordMutation  } from '../../features/auth/authApi';
import { Slide, toast, ToastContainer } from 'react-toastify';
import ReactLoading from 'react-loading';


function ChangePasswordModal({id}: {id: number}) {
  // Modal open state
  const [open, setOpen] = useState(false);

  // State for form values
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Show password toggle states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updateUserPassword, { isLoading }] = useUpdatePasswordMutation();

  // Error messages
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Toggle functions
  const toggleOldPasswordVisibility = () => setShowOldPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Open and close modal functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!oldPassword) newErrors.oldPassword = 'Old password is required';

    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
     
       try {
          // Make API request to register a new admin
          await updateUserPassword({
            id: id,
            data:{
              old_password: oldPassword,
              new_password: password,
              new_password_confirmation: confirmPassword
            },
            
          }).unwrap();
      
          // Show success toast notification
          toast.success("Updated password successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Slide,
          });
      
          handleClose(); // Close modal after success
      
          // Reset form fields
          setOldPassword("");
          setPassword("");
          setConfirmPassword("");

          setErrors({}); // Clear validation errors
        } catch (error) {
          console.error("Failed to update password:", error);

          // Extract error response properly
          const backendError = (error as any)?.data || (error as any);
        
          // Check if "error" key exists in response
          const errorMessage = backendError?.error || "Something went wrong!";
        
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
            transition: Slide,
          });
        }
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="text text-white"
        style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: 10, paddingRight: 10 }}
      >
        CHANGE PASSWORD
      </button>

      {/* Modal component */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: 'bold', fontFamily: 'Madimi One' }}>
            CHANGE YOUR PASSWORD
          </Typography>

        {/* Old Password Input */}
        <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined" error={!!errors.oldPassword}>
            <InputLabel htmlFor="old-password">Old Password</InputLabel>
            <OutlinedInput
              id="old-password"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleOldPasswordVisibility}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Old Password"
            />
            {errors.oldPassword && <Typography color="error" variant="caption">{errors.oldPassword}</Typography>}
          </FormControl>

          {/* New Password Input */}
          <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined" error={!!errors.password}>
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <OutlinedInput
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleNewPasswordVisibility}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
            {errors.password && <Typography color="error" variant="caption">{errors.password}</Typography>}
          </FormControl>

          {/* Confirm Password Input */}
          <FormControl sx={{ mt: 2, width: '100%' }} variant="outlined" error={!!errors.confirmPassword}>
            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
            {errors.confirmPassword && <Typography color="error" variant="caption">{errors.confirmPassword}</Typography>}
          </FormControl>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 20 }}>
            <button
              onClick={handleClose}
              className="text w-full"
              style={{ borderWidth: 3, borderColor: '#2C2C2C', color: '#2C2C2C', borderRadius: '4px', padding: '2px 20px' }}
            >
              CLOSE
            </button>

             <button
              onClick={handleSubmit}
              className="text text-white w-full"
              style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: "5px 20px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                  }}
              disabled={isLoading} 
              >
              {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "UPDATE"}
              </button>
          </div>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ChangePasswordModal;
