import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useRegisterAdminMutation } from '../../features/api/adminUsersApi';
import ReactLoading from 'react-loading';
import { Slide   , toast } from 'react-toastify';




function AddUserModal({ branches }: { branches: any[] }) {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerAdmin, {isLoading}] = useRegisterAdminMutation();

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);


  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranch(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setRole(event.target.value as string);
  };
  


  // Function to handle text input change dynamically
  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (field) {
        case 'name':
            setName(event.target.value);
            break;
        case 'phone':
            setPhone(event.target.value);
            break;
        case 'address':
            setAddress(event.target.value);
            break;
        case 'email':
            setEmail(event.target.value);
            break;
            
      default:
        break;
    }
  };

  const roleMapping: { [key: string]: number } = {
    Administrator: 1,
    Manager: 2,
    Staff: 3,
  };


const handleSubmit = async () => {
  // Validate the required fields
  const newErrors: { [key: string]: string } = {};

  if (!name) newErrors.name = "Name is required";

  // Email validation using regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    newErrors.email = "Please enter a valid email address";
  }

  // Phone number validation (assumes 10 digits, adjust as needed)
  const phoneRegex = /^\d{10}$/;
  if (!phone) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone)) {
    newErrors.phone = "Please enter a valid 10-digit phone number";
  }

  if (!address) newErrors.address = "Address is required";
  if (!branch) newErrors.branch = "Select a Branch";
  if (!role) newErrors.role = "Select a Role";

  setErrors(newErrors);
  const roleIds = roleMapping[role]; 

  // Stop submission if there are errors
  if (Object.keys(newErrors).length > 0) return;

  try {
    // Make API request to register a new admin
    await registerAdmin({
      name,
      email,
      phone,
      address,
      branch,
      role: roleIds 
    }).unwrap();

    // Show success toast notification
    toast.success("Admin added successfully!", {
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
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setBranch("");
    setRole("");

    setErrors({}); // Clear validation errors
  } catch (error) {
    console.error("Failed to add admin:", error);

    const errorMessage =
    (error as any)?.data?.errors
      ? Object.values((error as any).data.errors).flat().join("\n")
      : (error as any)?.data?.message || 
        (error as any)?.error || 
        "Something went wrong!";
  
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
      transition: Slide,
    });
  
  }
};


  return (
    <div>
      
      <button
        onClick={handleOpen}
        className="text text-white"
        style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: 10, paddingRight: 20, width: 100 }}
      >
        <AddRoundedIcon sx={{ color: "white", marginRight: 1 }} />
        ADD
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
            width: "50%",
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
            maxHeight: "90%",
            overflow: "auto",
             // Custom scrollbar styles
              '&::-webkit-scrollbar': {
                width: '4px', 
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888', 
                borderRadius: '4px', 
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555', 
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent', 
              }
         }}

        >
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
            ADD USER
          </Typography>

          <Box >
            <TextField
                label="Name"
                value={name}
                onChange={handleTextFieldChange('name')}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
                error={!!errors.name}
            />
            {errors.name && <Typography color="error" variant="caption">{errors.name}</Typography>}
          </Box>

          <Box >
            <TextField
                label="Email"
                value={email}
                onChange={handleTextFieldChange('email')}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
                error={!!errors.email}
            />
            {errors.email && <Typography color="error" variant="caption">{errors.email}</Typography>}
          </Box>

          <Box >
            <TextField
                label="Phone"
                value={phone}
                onChange={handleTextFieldChange('phone')}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
                error={!!errors.phone}
            />
            {errors.phone && <Typography color="error" variant="caption">{errors.phone}</Typography>}
          </Box>

          <Box >
            <TextField
                label="Address"
                value={address}
                onChange={handleTextFieldChange('address')}
                fullWidth
                size="small"
                multiline
                rows={2}
                sx={{ mt: 2 }}
                required
                error={!!errors.address}
            />
            {errors.address && <Typography color="error" variant="caption">{errors.address}</Typography>}
          </Box>



          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {/* Dropdown for Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.category}>
              <InputLabel id="province-select-label">Branch</InputLabel>
              <Select
                labelId="province-select-label"
                value={branch}
                onChange={handleBranchChange}
                label="Branch"
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                        maxHeight: 100, 
                        overflowY: 'auto', 
                    }
                  }
                }}
              >
                {branches.map((branch, key) => (
                    <MenuItem key={key} value={branch.branchName}>
                        {branch.branchName}
                    </MenuItem>
                ))}
              </Select>
              {errors.branch && <Typography color="error" variant="caption">{errors.branch}</Typography>}
            </FormControl>

            {/* Dropdown for Sub-Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.role}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                onChange={handleRoleChange}
                label="Role"
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 100,
                      overflowY: 'auto',
                    },
                  },
                }}
              >
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
              </Select>
              {errors.role && <Typography color="error" variant="caption">{errors.role}</Typography>}
            </FormControl>
          </Box>

       





          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "row", gap: 20, marginTop: 20 }}>
            <button
              onClick={handleClose}
              className="text w-full"
              style={{ borderWidth: 3, borderColor: "#2C2C2C", color: "#2C2C2C", borderRadius: "4px", padding: "2px 20px" }}
            >
              CLOSE
            </button>

            <button
              onClick={handleSubmit}
              className="text text-white w-full"
              style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: "5px 20px",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'}}
              disabled={isLoading} 
            >
              {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "REGISTER USER"}
            </button>
          </div>
        </Box>
      </Modal>
       
    </div>
  );
}

export default AddUserModal;
