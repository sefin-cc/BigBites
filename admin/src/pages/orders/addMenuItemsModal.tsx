import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, InputAdornment, Button, styled } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { inputBaseClasses } from '@mui/material/InputBase';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  

function AddMenuItemsModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [itemLabel, setItemLabel] = useState('');
  const [itemFullLabel, setItemFullLabel] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [image, setImage] = useState('');
  const [addOns, setAddOns] = useState([]);

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  // Function to handle text input change dynamically
  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    switch (field) {
      case 'itemLabel':
        setItemLabel(event.target.value);
        break;
      case 'itemFullLabel':
        setItemFullLabel(event.target.value);
        break;
      case 'description':
        setDescription(event.target.value);
        break;
      case 'price':
        setPrice(event.target.value ? parseFloat(event.target.value) : 0);
        break;
      case 'time':
        setTime(event.target.value ? parseFloat(event.target.value) : 0);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="text text-white"
        style={{ backgroundColor: "#2C2C2C", borderRadius: "4px", padding: 10, paddingRight: 20 }}
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
          }}
        >
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
            ADD NEW MENU ITEM
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {/* Dropdown for Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="BURGERS">BURGERS</MenuItem>
                <MenuItem value="BARKADAS">BARKADAS</MenuItem>
                <MenuItem value="SIDES">SIDES</MenuItem>
                <MenuItem value="DRINKS">DRINKS</MenuItem>
                <MenuItem value="DESSERTS">DESSERTS</MenuItem>
              </Select>
            </FormControl>

            {/* Dropdown for Sub-Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel id="subcategory-select-label">Sub-Category</InputLabel>
              <Select
                labelId="subcategory-select-label"
                value={subcategory}
                onChange={handleCategoryChange}
                label="Sub-Category"
              >
                <MenuItem value="BURGERS">BURGERS</MenuItem>
                <MenuItem value="BARKADAS">BARKADAS</MenuItem>
                <MenuItem value="SIDES">SIDES</MenuItem>
                <MenuItem value="DRINKS">DRINKS</MenuItem>
                <MenuItem value="DESSERTS">DESSERTS</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Text Fields */}
          <TextField
            label="Item Label"
            value={itemLabel}
            onChange={handleTextFieldChange('itemLabel')}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Full Item Label"
            value={itemFullLabel}
            onChange={handleTextFieldChange('itemFullLabel')}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
          <TextField
            label="Item Price"
            value={price}
            onChange={handleTextFieldChange('price')}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
            type="number"
          />
          <TextField
            label="Preparation Time"
            value={time}
            onChange={handleTextFieldChange('time')}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
            type="number"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ opacity: 0, pointerEvents: 'none', [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: { opacity: 1 } }}>
                  mins
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={handleTextFieldChange('description')}
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mt: 2 }}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 , backgroundColor: "#2C2C2C" }}
            >
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={(event: any) => console.log(event.target.files)}
                multiple
            />
            </Button>

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
              onClick={() => {
                // Handle your form submission logic here
                console.log("Category:", category);
                console.log("Subcategory:", subcategory);
                handleClose();
              }}
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

export default AddMenuItemsModal;
