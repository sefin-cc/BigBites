import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, InputAdornment, Button, styled, Checkbox } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';





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
 

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);


  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranch(event.target.value);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
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

  const handleSubmit = () => {
    // Validate the required fields
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Name is required';
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone number validation (assumes 10 digits, you can adjust this based on the phone number format you need)
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
        newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!address) newErrors.address = 'Address is required';
    if (!branch) newErrors.branch = 'Select a Branch';
    if (!role) newErrors.role = 'Select a Role';
   

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      // Handle your form submission logic here
      console.log("Form data submitted successfully!");
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Phone:", phone);
      console.log("Address:", address);
      console.log("Branch:", branch);
      console.log("Role:", role);
      handleClose();
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
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.subcategory}>
              <InputLabel id="city-select-label">Role</InputLabel>
              <Select
                labelId="city-select-label"
                value={role}
                onChange={handleRoleChange}
                label="Role"
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
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
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
              style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: "5px 20px" }}
            >
              SAVE
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default AddUserModal;
