import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAddSubCategoryMutation } from '../../features/api/menu/subCategoryApi';
import ReactLoading from 'react-loading';
import { Slide   , toast } from 'react-toastify';
import { useGetMenuQuery } from '../../features/api/menu/menu';



function AddSubCategoryModal({menu} : {menu: any[]| undefined;}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<number>(0);
  const [subcategory, setSubcategory] = useState('');
  const [addSubCategory, {isLoading}] = useAddSubCategoryMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { refetch } = useGetMenuQuery(); 

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setCategory(Number(event.target.value)); // Convert value to a number
  };
  // Function to handle subcategory change (typed event as React.ChangeEvent<HTMLInputElement>)
  const handleSubcategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubcategory(event.target.value);
  };

  const handleSubmit = async () => {
      const newErrors: { [key: string]: string } = {};
      
      if (!category) newErrors.category = 'Category is required';
      if (!subcategory) newErrors.subcategory = 'Subcategory is required';
  
      setErrors(newErrors);
  
      if (Object.keys(newErrors).length === 0) {
        try {
          await addSubCategory({
            category_id: category,
            label: subcategory,
          }).unwrap(); // Ensure errors are handled correctly
          refetch();
          toast.success('Sub Category added successfully!', {
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
          setCategory(0);
          setSubcategory('');
        
          setErrors({});
        } catch (err) {
          console.error('Failed to add subcategory:', err);
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
          <Box>
             {/* Dropdown for Category */}
            <FormControl size="small" fullWidth sx={{ mt: 2 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select<number> 
                labelId="category-select-label"
                value={category} // Ensure it's a number
                onChange={handleCategoryChange}
                label="Category"
                required
                error={!!errors.category}
              >
                {
                  [...new Map(menu?.map(item => [item.id, item])).values()].map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.category}
                    </MenuItem>
                  ))
                }

              </Select>
            </FormControl>

              {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
          </Box>
         
          <Box>
              {/* Text Field for Subcategory */}
              <TextField
                label="Sub-Category Name"
                value={subcategory}
                onChange={handleSubcategoryChange}
                fullWidth
                sx={{ mt: 2 }}
                size="small"
                required
                error={!!errors.subcategory}
              />
               {errors.subcategory && <Typography color="error" variant="caption">{errors.subcategory}</Typography>}
          </Box>
          

        <div style={{ display: "flex", flexDirection: "row", gap: 20 , marginTop: 20}}>
            <button
                onClick={handleClose}
                className="text w-full"
                style={{ borderWidth:3, borderColor: "#2C2C2C", color: "#2C2C2C", borderRadius: "4px",  padding: "2px 20px"}}
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
              {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "ADD SUB CATEGORY"}
            </button>
        </div>
            

          
        </Box>
      </Modal>
       
    </div>
  );
}

export default AddSubCategoryModal;
