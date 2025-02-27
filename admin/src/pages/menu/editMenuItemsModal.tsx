import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, InputAdornment, Button, styled } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { inputBaseClasses } from '@mui/material/InputBase';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

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

function EditMenuItemsModal({ rows }: { rows: any[] }) {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [category, setCategory] = useState('BURGERS');
  const [subcategory, setSubcategory] = useState('');
  const [itemLabel, setItemLabel] = useState('');
  const [itemFullLabel, setItemFullLabel] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [image, setImage] = useState('');
  const [addOns, setAddOns] = useState<{ label: string; price: number }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddAddOns = () => {
    setAddOns((prev) => [...prev, { label: "", price: 0 }]);
  }

  const handleRemoveAddOns = (key: number) => {
    const updatedAddOns = addOns.filter((_, index) => index !== key);
    setAddOns(updatedAddOns);
  }

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    setSubcategory(event.target.value);
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

  const handleSubmit = () => {
    // Validate the required fields
    const newErrors: { [key: string]: string } = {};

    if (!category) newErrors.category = 'Category is required';
    if (!subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!itemLabel) newErrors.itemLabel = 'Item Label is required';
    if (!itemFullLabel) newErrors.itemFullLabel = 'Full Item Label is required';
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (time <= 0) newErrors.time = 'Preparation time must be greater than 0';
    if (!description) newErrors.description = 'Description is required';

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
      // Handle your form submission logic here
      console.log("Form data submitted successfully!");
      console.log("Category:", category);
      console.log("Subcategory:", subcategory);
      console.log("Item Label:", itemLabel);
      console.log("Item Full Label:", itemFullLabel);
      console.log("Price:", price);
      console.log("Preparation Time:", time);
      console.log("Description:", description);
      handleClose();
    }
  };

  return (
    <div>

      <button  onClick={handleOpen} className="text px-6 py-1 rounded-md focus:outline-none" style={{borderColor: "#2C2C2C", borderWidth: 3}}>EDIT</button>

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
            EDIT MENU ITEM
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {/* Dropdown for Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.category}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                onChange={handleCategoryChange}
                label="Category"
                required
              >
                <MenuItem value="BURGERS">BURGERS</MenuItem>
                <MenuItem value="BARKADAS">BARKADAS</MenuItem>
                <MenuItem value="SIDES">SIDES</MenuItem>
                <MenuItem value="DRINKS">DRINKS</MenuItem>
                <MenuItem value="DESSERTS">DESSERTS</MenuItem>
              </Select>
              {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
            </FormControl>

            {/* Dropdown for Sub-Category */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.subcategory}>
              <InputLabel id="subcategory-select-label">Sub-Category</InputLabel>
              <Select
                labelId="subcategory-select-label"
                value={subcategory}
                onChange={handleSubCategoryChange}
                label="Sub-Category"
                required
              >
               {
                // Filter rows based on selected categoryType and extract unique subLabels
                [...new Set(rows.filter(item => item.category === category).map(item => item.subLabel))]
                  .map((subLabel, key) => (
                    <MenuItem key={key} value={subLabel}>
                      {subLabel}
                    </MenuItem>
                  ))
              }
              </Select>
              {errors.subcategory && <Typography color="error" variant="caption">{errors.subcategory}</Typography>}
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {/* Text Fields */}
            <Box sx={{width: "100%"}}>
              <TextField
                label="Item Label"
                value={itemLabel}
                onChange={handleTextFieldChange('itemLabel')}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
                error={!!errors.itemLabel}
              />
              {errors.itemLabel && <Typography color="error" variant="caption">{errors.itemLabel}</Typography>}
            </Box>
            
            <Box sx={{width: "100%"}}>
              <TextField
                label="Full Item Label"
                value={itemFullLabel}
                onChange={handleTextFieldChange('itemFullLabel')}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
                error={!!errors.itemFullLabel}
              />
              {errors.itemFullLabel && <Typography color="error" variant="caption">{errors.itemFullLabel}</Typography>}
            </Box>
            
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{width: "100%"}}>
            <TextField
              label="Item Price"
              value={price}
              onChange={handleTextFieldChange('price')}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              type="number"
              required
              error={!!errors.price}
            />
            {errors.price && <Typography color="error" variant="caption">{errors.price}</Typography>}
            </Box>
            
          <Box sx={{width: "100%"}}> 
          <TextField
              label="Preparation Time"
              value={time}
              onChange={handleTextFieldChange('time')}
              fullWidth
              size="small"
              sx={{ mt: 2 }}
              type="number"
              required
              error={!!errors.time}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ opacity: 0, pointerEvents: 'none', [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: { opacity: 1 } }} >
                    mins
                  </InputAdornment>
                ),
              }}
            />
            {errors.time && <Typography color="error" variant="caption">{errors.time}</Typography>}
          </Box>
 
            
          </Box>

          <Box >
          <TextField
            label="Description"
            value={description}
            onChange={handleTextFieldChange('description')}
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mt: 2 }}
            required
            error={!!errors.description}
          />
          {errors.description && <Typography color="error" variant="caption">{errors.description}</Typography>}
          </Box>
          

          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            onClick={() => handleAddAddOns()}
            sx={{ mt: 2, mr: 2, backgroundColor: "#2C2C2C" }}
            startIcon={<AddRoundedIcon />}
          >
            AddOns
          </Button>

          {addOns.map((item, key) => (
            <Box key={key} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <TextField
                label="Add Ons Label"
                value={item.label}
                onChange={(e) => {
                  const updatedAddOns = [...addOns];
                  updatedAddOns[key].label = e.target.value;
                  setAddOns(updatedAddOns);
                }}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
              />
              <TextField
                label="Add Ons Price"
                value={item.price}
                onChange={(e) => {
                  const updatedAddOns = [...addOns];
                  updatedAddOns[key].price = parseFloat(e.target.value) || 0;
                  setAddOns(updatedAddOns);
                }}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                type="number"
              />
              <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                onClick={() => handleRemoveAddOns(key)}
                sx={{ mt: 2, backgroundColor: "#2C2C2C" }}
              >
                <RemoveRoundedIcon sx={{ color: "white" }} />
              </Button>
            </Box>
          ))}

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2, backgroundColor: "#2C2C2C" }}
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

export default EditMenuItemsModal;
