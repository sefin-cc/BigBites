import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function AddSubCategoryModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  // Function to handle subcategory change (typed event as React.ChangeEvent<HTMLInputElement>)
  const handleSubcategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubcategory(event.target.value);
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
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
            ADD NEW SUB-CATEGORY 
          </Typography>

          {/* Dropdown for Category */}
          <FormControl fullWidth sx={{ mt: 2 }}>
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

          {/* Text Field for Subcategory */}
          <TextField
            label="Sub-Category Name"
            value={subcategory}
            onChange={handleSubcategoryChange}
            fullWidth
            sx={{ mt: 2 }}
          />

        <div style={{ display: "flex", flexDirection: "row", gap: 20 , marginTop: 20}}>
            <button
                onClick={handleClose}
                className="text w-full"
                style={{ borderWidth:3, borderColor: "#2C2C2C", color: "#2C2C2C", borderRadius: "4px",  padding: "5px 20px"}}
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
                style={{ backgroundColor: "#2C2C2C", borderRadius: "4px",  padding: "5px 20px"}}
            >
                SAVE
            </button>
        </div>
            

          
        </Box>
      </Modal>
    </div>
  );
}

export default AddSubCategoryModal;
