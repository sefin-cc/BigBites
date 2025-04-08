import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, styled, Checkbox } from '@mui/material';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import { useUpdateBranchMutation, useGetBranchByIdQuery } from '../../features/api/branchApi';
import ReactLoading from 'react-loading';
import { Slide, ToastContainer, toast } from 'react-toastify';

interface Province {
  name: string;
  cities: any[];
}

interface Location {
  Luzon: {
    provinces: Province[];
  };
}


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

function EditBranches({ location, id }: { location: Location, id: Set<string>}) {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedOpeningTime, setSelectedOpeningTime] = useState<string>('');
  const [selectedClosingTime, setSelectedClosingTime] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const branchId = id.values().next().value || ""; 
  const { data: branch, isLoading: branchLoading, refetch } = useGetBranchByIdQuery(branchId);
  const [updateBranch, { isLoading }] = useUpdateBranchMutation();




  // Function to generate time options in 15-minute intervals
  const generateTimeOptions = () => {
    const times: string[] = [];
    const hours = 24;
    const minutes = [0, 15, 30, 45]; // 15-minute intervals

    for (let h = 0; h < hours; h++) {
      minutes.forEach((m) => {
        const hour = h < 10 ? `0${h}` : `${h}`;
        const minute = m < 10 ? `0${m}` : `${m}`;
        times.push(`${hour}:${minute}`);
      });
    }

    return times;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  // Function to handle opening the modal
  const handleOpen = () => {setOpen(true); refetch();};

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);


  const handleProvinceChange = (event: SelectChangeEvent) => {
    setProvince(event.target.value);
  };

  const handleCityChange = (event: SelectChangeEvent) => {
    setCity(event.target.value);
  };

  const handleOpeningTimeChange = (event: SelectChangeEvent<string>) => {
    setSelectedOpeningTime(event.target.value);
  };

  const handleClosingTimeChange = (event: SelectChangeEvent<string>) => {
    setSelectedClosingTime(event.target.value);
  };


  // Function to handle text input change dynamically
  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (field) {
      case 'name':
        setName(event.target.value);
        break;
      case 'address':
        setAddress(event.target.value)
     
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (branch) {
      setName(branch.branchName || '');
      setAddress(branch.fullAddress || '');
      setProvince(branch.province || '');
      setCity(branch.city || '');
      setSelectedOpeningTime(branch.openingTime || '');
      setSelectedClosingTime(branch.closingTime || '');
      setChecked(branch.acceptAdvancedOrder || false);
    }
  }, [branch]);

  const handleSubmit = async () => {
    // Validate the required fields
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = 'Branch name is required';
    if (!province) newErrors.province = 'Province is required';
    if (!city) newErrors.city = 'City is required';
    if (!address) newErrors.address = 'Full address is required';
    if (!selectedOpeningTime) newErrors.openingTime = 'Opening time is required';
    if (!selectedClosingTime) newErrors.closingTime = 'Closing time is required';
   

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      // Handle your form submission logic here
     try {
             await updateBranch({
                id: branchId,
                updates: { 
                  branchName: name,
                  province,
                  city,
                  fullAddress: address,
                  openingTime: selectedOpeningTime,
                  closingTime: selectedClosingTime,
                  acceptAdvancedOrder: checked,
                },
               
             }).unwrap(); // Ensure errors are handled correctly
     
             toast.success('Branch update successfully!', {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "light",
               transition: Slide,
             });
             handleClose(); // Close modal after successful submission
             
             // Reset form fields
             setName('');
             setProvince('');
             setCity('');
             setAddress('');
             setSelectedOpeningTime('');
             setSelectedClosingTime('');
             setChecked(false);
             setErrors({});
           } catch (err) {
             console.error('Failed to update branch:', err);
              toast.error('Something went wrong!', {
                   position: "top-right",
                   autoClose: 5000,
                   hideProgressBar: false,
                   closeOnClick: true,
                   pauseOnHover: true,
                   draggable: true,
                   progress: undefined,
                   theme: "light",
                   transition: Slide,
                 });
           }
    }
  };

  return (
    <div>
      <button   onClick={handleOpen}  className="bg-white hover:bg-gray-200" style={{ padding: 10, borderRadius: "4px" }}>
        <ModeEditRoundedIcon sx={{ color: "gray" }} />
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
            branchLoading ? <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> :
            
            <Box>
              <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
                EDIT BRANCH
              </Typography>
    
              <Box >
                <TextField
                    label="Branch Name"
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
    
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                {/* Dropdown for Category */}
                <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.category}>
                  <InputLabel id="province-select-label">Province</InputLabel>
                  <Select
                    labelId="province-select-label"
                    value={province}
                    onChange={handleProvinceChange}
                    label="Province"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, 
                          overflowY: 'auto', 
                        }
                      }
                    }}
                  >
                    {location.Luzon.provinces.map((province, key) => (
                        <MenuItem key={key} value={province.name}>
                        {province.name}
                        </MenuItem>
                    ))}
                  </Select>
                  {errors.province && <Typography color="error" variant="caption">{errors.province}</Typography>}
                </FormControl>
    
                {/* Dropdown for Sub-Category */}
                <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.subcategory}>
                  <InputLabel id="city-select-label">City</InputLabel>
                  <Select
                    labelId="city-select-label"
                    value={city}
                    onChange={handleCityChange}
                    label="City"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, 
                          overflowY: 'auto', 
                        }
                      }
                    }}
                  >
                  {province && (
                      location.Luzon.provinces
                        .find((p) => p.name === province)
                        ?.cities.map((city, key) => (
                          <MenuItem key={key} value={city}>
                            {city}
                          </MenuItem>
                        ))
                    )}
                  </Select>
                  {errors.city && <Typography color="error" variant="caption">{errors.city}</Typography>}
                </FormControl>
              </Box>
    
              <Box >
                <TextField
                    label="Full Address"
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
    
              <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.subcategory}>
                <InputLabel>Opening Time</InputLabel>
                <Select
                    value={selectedOpeningTime}
                    onChange={handleOpeningTimeChange}
                    label="Opening Time"
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, 
                          overflowY: 'auto', 
                        }
                      }
                    }}
                >
                    {generateTimeOptions().map((time, index) => (
                    <MenuItem key={index} value={time}>
                        {time}
                    </MenuItem>
                    ))}
                </Select>
                {errors.openingTime && <Typography color="error" variant="caption">{errors.openingTime}</Typography>}
                </FormControl>
                <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.subcategory}>
                <InputLabel>Closing Time</InputLabel>
                <Select
                    value={selectedClosingTime}
                    onChange={handleClosingTimeChange}
                    label="Closing Time"
                    size="small"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 150, 
                          overflowY: 'auto', 
                        }
                      }
                    }}
                >
                    {generateTimeOptions().map((time, index) => (
                    <MenuItem key={index} value={time}>
                        {time}
                    </MenuItem>
                    ))}
                </Select>
                {errors.closingTime && <Typography color="error" variant="caption">{errors.closingTime}</Typography>}
                </FormControl>
              </Box>
    
    
            <Box sx={{ display: "flex", flexDirection: "row" , alignItems: "center",  mt: 2}}>
              <Checkbox
                checked={checked}
                onChange={handleChange}
              />
              <p>Accept Advance Order?</p>
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
                    justifyContent: 'center'
                   }}
                  disabled={isLoading} 
                >
                  {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "UPDATE BRANCH"}
                </button>
              </div>
            </Box>
     

          }

      </Box>
      </Modal>
      <ToastContainer/>
    </div>
  );
}

export default EditBranches;
