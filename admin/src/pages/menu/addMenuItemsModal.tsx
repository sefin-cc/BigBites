import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, InputAdornment, Button, styled } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { inputBaseClasses } from '@mui/material/InputBase';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { useAddItemMutation } from '../../features/api/menu/itemApi';
import { useGetMenuQuery } from '../../features/api/menu/menu';
import ReactLoading from 'react-loading';
import { useAddAddOnToItemMutation } from '../../features/api/menu/addOnApi';
import { useUploadImageMutation } from '../../features/api/imageApi';


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

function AddMenuItemsModal({menu} : {menu: any[]| undefined;}) {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [category, setCategory] = useState(0);
  const [subcategory, setSubcategory] = useState(0);
  const [itemLabel, setItemLabel] = useState('');
  const [itemFullLabel, setItemFullLabel] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addOns, setAddOns] = useState<{ label: string; price: number }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { refetch } = useGetMenuQuery(); 
  const [addMenuItem] = useAddItemMutation();
  const [addAddOnToItem] = useAddAddOnToItemMutation();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [uploadImage] = useUploadImageMutation();

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
  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    setCategory(Number(event.target.value)); // Convert value to a number
  }

  const handleSubCategoryChange = (event: SelectChangeEvent<number>) => {
    setSubcategory(Number(event.target.value));
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

  const handleSubmit = async () => {
    // Validate the required fields
    const newErrors: { [key: string]: string } = {};

    if (!category) newErrors.category = 'Category is required';
    if (!subcategory) newErrors.subcategory = 'Subcategory is required';
    if (!itemLabel) newErrors.itemLabel = 'Item Label is required';
    if (!itemFullLabel) newErrors.itemFullLabel = 'Full Item Label is required';
    if (price <= 0) newErrors.price = 'Price must be greater than 0';
    if (time <= 0) newErrors.time = 'Preparation time must be greater than 0';
    if (!description) newErrors.description = 'Description is required';
    if (!imageFile) newErrors.image = "Image is required";

    setErrors(newErrors);

    // If there are no errors, proceed with form submission
    if (Object.keys(newErrors).length === 0) {
        try {
          setIsLoading(true);
     
          const imageResponse = await uploadImage({
            image: imageFile as File,
            type: "menuitem", 
          }).unwrap();        
          
          // If upload fails, stop execution
          if (!imageResponse.url) {
            throw new Error("Image upload failed.");
          }


          const newItem = await addMenuItem({
            sub_category_id: subcategory,
            label: itemLabel,
            full_label: itemFullLabel,
            description: description,
            price: price,
            time: time.toString(),
            image: imageResponse.url,
          }).unwrap();

        if (addOns.length > 0) {
          await Promise.all(
            addOns.map((addon) =>
              addAddOnToItem({
                item_id: newItem.id, // Use the newly created item's ID
                label: addon.label,
                price: addon.price,
              })
            )
          );
        }
    
        refetch();

        toast.success('Menu Item added successfully!', {
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
        setSubcategory(0);
        setItemLabel('');
        setItemFullLabel('');
        setDescription('');
        setPrice(0);
        setTime(0);
        setImageFile(null);
        setAddOns([]);
        setErrors({});

      } catch (err) {
        setIsLoading(false);
        console.error('Failed to add Menu Item:', err);
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
      }finally{
        setIsLoading(false);
      }
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
            ADD NEW MENU ITEM
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
                {
                  [...new Map(menu?.map(item => [item.id, item])).values()].map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.category}
                    </MenuItem>
                  ))
                }       
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
                  menu
                    ?.find(cat => cat.id === category) 
                    ?.sub_categories 
                    ?.map((subcat:any, key:number) => (
                      <MenuItem key={key} value={subcat.id}>
                        {subcat.label}
                      </MenuItem>
                    )) || [] 
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


            <Button sx={{ mt: 2, backgroundColor: "#2C2C2C" }} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Upload Image
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
              justifyContent: 'center'}}
              disabled={isLoading} 
            >
              {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "ADD ITEM"}
            </button>
          </div>
        </Box>
      </Modal>
      <ToastContainer/>
    </div>
  );
}

export default AddMenuItemsModal;
