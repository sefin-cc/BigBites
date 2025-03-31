import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, styled } from '@mui/material';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useUpdatePromoMutation, useGetPromoByIdQuery } from '../../features/api/promoApi';
import ReactLoading from 'react-loading';
import { Slide, ToastContainer, toast } from 'react-toastify';
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

function EditPromoModal({id}: {id: Set<string>}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const promoId = Number(id.values().next().value);
  const [updatePromo] = useUpdatePromoMutation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: promo, isLoading: promoLoading, refetch } = useGetPromoByIdQuery(promoId);
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>();

  // Function to handle opening the modal
  const handleOpen = () => {setOpen(true); refetch();};

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

   

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let newImageUrl = promo?.image;
      try {
        setIsLoading(true);
        if (imageFile && promo) {
          if (promo.image !== "") {
            await deleteImage({ url: promo.image }).unwrap();
          }
        
          const imageResponse = await uploadImage({
            image: imageFile as File,
            type: "promo",
          }).unwrap();
        
          newImageUrl = imageResponse.url; // Store the new image URL
        }
        await updatePromo({
          id: promoId,
          data:{
             label: label,
             image: newImageUrl
          },
        }).unwrap(); // Ensure errors are handled correctly

        toast.success('Promo updated successfully!', {
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
        setImageFile(null);
        setErrors({});
      } catch (err) {
        console.error('Failed to update promo:', err);
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
                UPDATE PROMO
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
