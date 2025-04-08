import { useState, useEffect } from 'react';
import { Modal, Box, Typography, FormHelperText, InputLabel, FormControl, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { logo } from '../../assets/logo64';
import { useGetBranchesQuery } from '../../features/api/branchApi';
import { useGetOrdersQuery } from '../../features/api/orderApi';
import isBetween from 'dayjs/plugin/isBetween';

function BranchEarningModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null); // State for the selected branch
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ branch?: string }>({}); // State for field-specific errors
  const { data: branches, isLoading: branchesLoading } = useGetBranchesQuery();
  const { data: orders, isLoading: ordersLoading } = useGetOrdersQuery();
  const [isReady, setIsReady] = useState(false);
  dayjs.extend(isBetween);

  useEffect(() => {
    if (!branchesLoading && !ordersLoading && branches && orders) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [branchesLoading, ordersLoading, branches, orders]);
  
  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

   // Validation function
   const handleGenerate = () => {

    if (!isReady) return; 
    if (!orders) return;

    const validationErrors: { branch?: string } = {};

    if (!startDate || !endDate) {
      setError('Both dates are required.');
      return;
    }

    if (endDate.isBefore(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    if (!selectedBranch) {
      validationErrors.branch = 'Branch is required.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setError(null); // Clear any previous error
    setErrors({}); // Clear any field-specific errors
    // Proceed with form submission logic here
    console.log('dates:', { startDate, endDate, selectedBranch });
    console.log('orders:' + orders);

    const filteredOrders = orders.filter(order => {
      const orderDate = dayjs(order.timestamp); // Convert the order timestamp to Dayjs
      const isDateInRange = orderDate.isBetween(startDate, endDate, null, '[]'); // Check if order is within the date range
  
      // Check if order status is 'completed'
      const isStatusCompleted = order.status === 'completed'; 
  
      // If no branch is selected, include all orders in the selected date range that are completed
      if (!selectedBranch) {
          return isDateInRange && isStatusCompleted;
      }
  
      // Otherwise, check if the selected branch matches and the order status is 'completed'
      const isBranchMatch = order.branch?.branchName === selectedBranch;
  
      return isDateInRange && isBranchMatch && isStatusCompleted;
  });
  

    generatePDF(filteredOrders);
    handleClose();
  };

   const generatePDF = (filteredOrders : any[]) => {


    const grossEarnings = filteredOrders.reduce((acc, filteredOrders) => acc + filteredOrders.fees.subTotal, 0);
    const totalDiscounts = filteredOrders.reduce((acc, filteredOrders) => acc + filteredOrders.fees.discountDeduction, 0);
    const totalDeliveryFee= filteredOrders.reduce((acc, filteredOrders) => acc + filteredOrders.fees.deliveryFee, 0);
    const totalEarnings = filteredOrders.reduce((acc, filteredOrders) => acc + filteredOrders.fees.grandTotal, 0);

     const doc = new jsPDF();
   
     doc.setFontSize(14);
      // Define the text you want to center
     const text = "Branch Earnings Report";
 
     // Calculate the width of the text
     const textWidth = doc.getStringUnitWidth(text) * 14 / doc.internal.scaleFactor;
 
     // Calculate the x coordinate to center the text
     const xOffset = (doc.internal.pageSize.width / 2) - (textWidth / 2);
 
     // Add the centered title to the PDF
     doc.text(text, xOffset, 27);
     
     const imgWidth = 14;  
     const imgHeight = 11; 
 
     // Calculate the x offset to center the image
     const imgXOffset = (doc.internal.pageSize.width / 2) - (imgWidth / 2); 
 
     // Add the centered image to the PDF
     doc.addImage(logo, 'PNG', imgXOffset, 10, imgWidth, imgHeight);
 

     const textDescription = `Earnings Summary for the ${selectedBranch} branch.`;
     const textDesWidth = doc.getStringUnitWidth(textDescription) * 10 / doc.internal.scaleFactor;
 
     // Calculate the x coordinate to center the text
     const xOffsetDes = (doc.internal.pageSize.width / 2) - (textDesWidth / 2);
 
     doc.setFontSize(10);
     doc.text(textDescription, xOffsetDes, 35);
     doc.text("Branch Name:", 15, 55);
     doc.text(selectedBranch||"" , 15, 60);
     doc.text("Duration:", 15, 70);
     doc.text(`${startDate?.format('DD-MM-YYYY')} to ${endDate?.format('DD-MM-YYYY')}`, 15, 75);

     // Table headers
     const headers = ['Completed Orders','Gross Earning', 'Given Discounts', 'Given Delivery Fees' ,'Total Earnings'];
     const rows = [
        [filteredOrders.length, `PHP ${grossEarnings.toFixed(2)}`, `PHP ${totalDiscounts.toFixed(2)}`, `PHP ${totalDeliveryFee.toFixed(2)}`,`PHP ${totalEarnings.toFixed(2)}`]
     ];
   
     // Generate the table using autoTable
    autoTable(doc, {
       startY: 80,
       head: [headers],
       body: rows,
       theme: 'striped',
       margin: { top: 10 },
       headStyles: {
         fillColor: "#FB7F3B",
       },
       
     });
 
     const blob = doc.output("bloburl");
     window.open(blob);
   };

  return (
    <div>
      <div onClick={handleOpen} className="flex border rounded-md border-gray-300 shadow p-3 max-w-3xs text-gray-800 bg-white hover:bg-gray-50  h-40">
        <div className='flex justify-center items-center mr-3'>
            <PaymentsRoundedIcon sx={{ color: '#f2aa83', width: 50, height: 50}} />
        </div>
        <div>
            <p style={{fontFamily: "Madimi One"}}>BRANCH EARNINGS REPORT</p>
            <p className="mt-1 text-xs text-justify">Generates a printable file containing the earnings and summary of a specific branch within the selected date range.</p>
        </div>
    </div>

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
          <Typography variant="h6" id="simple-modal-title" sx={{ marginBottom: 3, fontWeight: 'bold', fontFamily: 'Madimi One' }}>
            BRANCH SUMMARY REPORT
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex gap-3">
              <div>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
              </div>

              <div>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </div>
            </div>

            {error && <FormHelperText error>{error}</FormHelperText>} 

          </LocalizationProvider>

          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {/* Dropdown for Branch */}
            <FormControl fullWidth size="small" sx={{ mt: 2 }} error={!!errors.branch}>
              <InputLabel id="branch-select-label">Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                value={selectedBranch || ''}
                onChange={(e) => setSelectedBranch(e.target.value)}
                label="Branch"
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                      overflowY: 'auto',
                    }
                  }
                }}
              >
                {branches?.map((branch, key: number) => (
                  <MenuItem key={key} value={branch.branchName}>
                    {branch.branchName}
                  </MenuItem>
                ))}
              </Select>
              {errors.branch && <Typography color="error" variant="caption">{errors.branch}</Typography>}
            </FormControl>

          </Box>

          <div style={{ display: 'flex', flexDirection: 'row', gap: 20, marginTop: 20 }}>
              <button
                onClick={handleClose}
                className="text w-full"
                style={{ borderWidth:3, borderColor: "#2C2C2C", color: "#2C2C2C", borderRadius: "4px",  padding: "2px 20px"}}
               >
                CLOSE
            </button>
          
            <button
                onClick={handleGenerate}
                className="text text-white w-full"
                style={{ backgroundColor: "#2C2C2C", borderRadius: "4px",  padding: "5px 20px"}}
            >
                GENERATE
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default BranchEarningModal;
