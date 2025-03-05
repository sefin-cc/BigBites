import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';

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

function EditPromoModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);
  // State for form values
  const [label, setLabel] = useState('');

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to handle category change (typed event as SelectChangeEvent)
  const handleLabelChange = (event: SelectChangeEvent) => {
    setLabel(event.target.value);
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
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: "bold", fontFamily: "Madimi One" }}>
            EDIT PROMO
          </Typography>

          <TextField
            label="Promos Label"
            value={label}
            onChange={() =>handleLabelChange}
            fullWidth
            sx={{ mt: 2 }}
            size="small"
          />

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
            onClick={() => {
                // Handle your form submission logic here
                console.log("LAbel:", label);
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

export default EditPromoModal;
