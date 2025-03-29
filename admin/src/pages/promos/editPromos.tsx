import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, styled } from '@mui/material';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUpdatePromoMutation, useGetPromoByIdQuery } from '../../features/api/promoApi';
import ReactLoading from 'react-loading';
import { Slide, ToastContainer, toast } from 'react-toastify';

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

function EditPromoModal({id}: {id: Set<string>}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const promoId = Number(id.values().next().value);
  const [updatePromo, {isLoading}] = useUpdatePromoMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: promo, isLoading: promoLoading } = useGetPromoByIdQuery(promoId);
  

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => {
    setLabel("");
    setOpen(false);
  };

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };



  const handleSubmit = async () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!label) newErrors.label = 'Promo name is required';
    // if (!province) newErrors.province = 'Province is required';
   

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await updatePromo({
          id: promoId,
          data:{
             label: label,
             image: "https://phmenu.net/wp-content/uploads/2024/01/promo-1024x683.webp"
          },
        }).unwrap(); // Ensure errors are handled correctly

        toast.success('Promo added successfully!', {
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
        setLabel('');
        setErrors({});
      } catch (err) {
        console.error('Failed to add promo:', err);
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

  useEffect(() =>{
    if(promo){
      setLabel(promo.label);
    }
  }, [promo]);


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
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
          }}
        >
          {
            promoLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> :
            <Box>
              <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
                ADD PROMO
              </Typography>

              <Box>
                <TextField
                  label="Promos Label"
                  value={label}
                  onChange={handleLabelChange}
                  fullWidth
                  sx={{ mt: 2 }}
                  size="small"
                  required
                  error={!!errors.label}
                />
                {errors.label && <Typography color="error" variant="caption">{errors.label}</Typography>}
              </Box>
              

            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2, backgroundColor: "#2C2C2C" }}
              > Upload Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event: any) => console.log(event.target.files)}
                  multiple
                />
              </Button>

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
                  style={{ backgroundColor: "#2C2C2C", borderRadius: "4px",  padding: "5px 20px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={isLoading} 
                >
                  {isLoading ?  <ReactLoading type="bubbles" color="#FFEEE5" height={30} width={30} /> : "EDIT PROMO"}
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

export default EditPromoModal;
