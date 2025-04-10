import React, { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Button, styled } from '@mui/material';
import { useGetLoggedInAdminQuery, useUpdateAccountMutation } from '../../features/auth/authApi';
import ReactLoading from 'react-loading';
import { Slide, toast } from 'react-toastify';
import { useGetBranchesQuery } from '../../features/api/branchApi';
import { useDeleteImageMutation, useUploadImageMutation } from '../../features/api/imageApi';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



function UpdateUserModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: user, isLoading: userLoading , refetch} = useGetLoggedInAdminQuery();
  const { data: branches } = useGetBranchesQuery();
  const [updateUser] = useUpdateAccountMutation();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  // Function to handle opening the modal
  const handleOpen = () => {setOpen(true); refetch();};

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);


  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranch(event.target.value);
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
  
  const handleSubmit = async () => {
    // Validate the required fields

    if (!user){
        return;
    }
    
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
   

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
    let newImageUrl = user?.image;
     try {
      setIsLoading(true);
      if (imageFile && user) {
        if (user.image && user.image !== "") {
          await deleteImage({ url: user.image }).unwrap();
        }
        
        const imageResponse = await uploadImage({
          image: imageFile as File,
          type: "profile",
        }).unwrap();
      
        newImageUrl = imageResponse.url; // Store the new image URL
      }

        // Make API request to register a new admin
        await updateUser({
          id: user.id,
          data:{
            name,
            email,
            phone,
            address,
            branch,
            image: newImageUrl,
          },
         
        }).unwrap();
    
        // Show success toast notification
        toast.success("User updated successfully!", {
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
        setImageFile(null);
        setErrors({}); // Clear validation errors
      } catch (error) {
        console.error("Failed to update user:", error);
    
        const errorMessage =
          (error as any)?.data?.message ||
          (error as any)?.error ||
          "Something went wrong!";
          
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Slide,
        });
      } finally{
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
      setPhone(user?.phone);
      setAddress(user?.address);
      setBranch(user?.branch);
    }
  }, [user]);

  return (
    <div>
      
    <button
        onClick={() =>{handleOpen()}}
        className="text text-white"
        style={{ marginTop: 10 , backgroundColor: "#2C2C2C", borderRadius: "4px", padding: 5, paddingRight: 15, paddingLeft: 15 }}
        >
        EDIT 
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
            {
                userLoading ? <ReactLoading type="bubbles" color="#FB7F3B" height={30} width={30} /> :
                <Box>
                    <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
                        UPDATE YOUR INFORMATION
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
                            {branches?.map((branch, key) => (
                                <MenuItem key={key} value={branch.branchName}>
                                    {branch.branchName}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.branch && <Typography color="error" variant="caption">{errors.branch}</Typography>}
                        </FormControl>
                    </Box>

                    
                    <Button sx={{ mt: 2, backgroundColor: "#2C2C2C" }} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Replace Image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.target.files && event.target.files[0]) {
                          setImageFile(event.target.files[0]); 
                        }
                      }}
                    />
                  </Button>
                  {imageFile && <Typography variant="caption">{imageFile.name}</Typography>}
              

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
                            justifyContent: 'center'
                            }}
                        disabled={isLoading} 
                        >
                        {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "UPDATE"}
                        </button>
                    </div>
                </Box>
            }


        </Box>
      </Modal>
    </div>
  );
}

export default UpdateUserModal;
