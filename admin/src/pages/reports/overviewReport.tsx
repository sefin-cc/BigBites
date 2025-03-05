import React, { useState } from 'react';
import { Modal, Box, Typography, Button, FormHelperText } from '@mui/material';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { logo } from '../../assets/logo64';
import orders from "../../data/orders.json";
import isBetween from 'dayjs/plugin/isBetween';

const branches = [
  { id: "1", branchName: "SM DAGUPAN CITY", province: "Pangasinan", city: "Dagupan", fullAddress: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
  { id: "2", branchName: "SM CITY URDANETA", province: "Pangasinan", city: "Urdaneta", fullAddress: "2nd St, Urdaneta, Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
  { id: "3", branchName: "CITYMALL SAN CARLOS", province: "Pangasinan", city: "San Carlos", fullAddress: "Bugallon St, cor Posadas St, San Carlos City, Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
  { id: "4", branchName: "ROBINSONS PLACE LA UNION", province: "La Union", city: "San Fernando", fullAddress: "Brgy, MacArthur Hwy, San Fernando, La Union", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: true },
];

function OverviewModal() {
  // State to control the opening and closing of the modal
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(1, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [error, setError] = useState<string | null>(null);

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Validation function
  const handleGenerate = () => {
    if (!startDate || !endDate) {
      setError('Both dates are required.');
      return;
    }

    if (endDate.isBefore(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setError(null); // Clear any previous error
    // Proceed with form submission logic here
    const filteredOrders = orders.filter(order => {
      const orderDate = dayjs(order.timestamp); // Convert the order timestamp to Dayjs
      const isDateInRange = orderDate.isBetween(startDate, endDate, null, '[]'); 
      const isStatusCompleted = order.status === 'completed'; 
      return isDateInRange && isStatusCompleted; 
});
    generatePDF(filteredOrders, branches);
    handleClose();
  };

  const generatePDF = (filteredOrders: any[], allBranches: any[]) => {
    // Create a map for branches with initial values
    const branches = allBranches.reduce((acc, branch) => {
      // Initialize each branch with default values
      acc[branch.branchName] = {
        completedOrders: 0,
        grossEarnings: 0,
        totalDiscounts: 0,
        totalEarnings: 0,
      };
      return acc;
    }, {});
  
    // Group orders by branch and accumulate the totals
    filteredOrders.forEach(order => {
      order.branch.forEach((branch: { branchName: string; }) => {
        const branchName = branch.branchName;
  
        // Update the corresponding branch in the accumulator
        if (branches[branchName]) {
          branches[branchName].completedOrders += 1;
          branches[branchName].grossEarnings += order.fees.subTotal;
          branches[branchName].totalDiscounts += order.fees.discountDeduction;
          branches[branchName].totalEarnings += order.fees.grandTotal;
        }
      });
    });
  
    // Convert branches data into an array of rows for the table
    const rows = Object.keys(branches).map(branchName => {
      const branchData = branches[branchName];
      return [
        branchName,
        branchData.completedOrders,
        `PHP ${branchData.grossEarnings.toFixed(2)}`,
        `PHP ${branchData.totalDiscounts.toFixed(2)}`,
        `PHP ${branchData.totalEarnings.toFixed(2)}`
      ];
    });
  
    // Calculate grand totals for the bottom row
    const grandTotals = {
      completedOrders: rows.reduce((acc, row) => acc + row[1], 0),
      grossEarnings: rows.reduce((acc, row) => acc + parseFloat(row[2].replace('PHP ', '').replace(',', '')), 0),
      totalDiscounts: rows.reduce((acc, row) => acc + parseFloat(row[3].replace('PHP ', '').replace(',', '')), 0),
      totalEarnings: rows.reduce((acc, row) => acc + parseFloat(row[4].replace('PHP ', '').replace(',', '')), 0)
    };
  
    // Add Grand Total row
    rows.push([
      'Grand Total',
      grandTotals.completedOrders,
      `PHP ${grandTotals.grossEarnings.toFixed(2)}`,
      `PHP ${grandTotals.totalDiscounts.toFixed(2)}`,
      `PHP ${grandTotals.totalEarnings.toFixed(2)}`
    ]);
  
    const doc = new jsPDF();
  
    doc.setFontSize(14);
    // Define the text you want to center
    const text = "Overview Earnings Report";
  
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
  
    const textDescription = `Overview of earnings for the specified date range.`;
    const textDesWidth = doc.getStringUnitWidth(textDescription) * 10 / doc.internal.scaleFactor;
  
    // Calculate the x coordinate to center the text
    const xOffsetDes = (doc.internal.pageSize.width / 2) - (textDesWidth / 2);
  
    doc.setFontSize(10);
    doc.text(textDescription, xOffsetDes, 35);
  
    doc.text("Duration:", 15, 50);
    doc.text(`${startDate?.format('DD-MM-YYYY')} to ${endDate?.format('DD-MM-YYYY')}`, 15, 55);
  
    // Table headers
    const headers = ['Branch Name', 'Completed Orders', 'Gross Earning', 'Total of Given Discounts', 'Total Earnings'];
    autoTable(doc, {
      startY: 60,
      head: [headers],
      body: rows,
      theme: 'striped',
      margin: { top: 10 },
      headStyles: {
        fillColor: "#FB7F3B",
      },
      didDrawCell: function (data) {
        // Check if the row is the last one (Grand Total row)
        if (data.row.index === data.table.body.length - 1) { // Access the body of the table
          // Apply bold font style to the Grand Total row
          data.cell.styles.fontStyle = 'bold';
          
          // Set the background color for the Grand Total row
          data.cell.styles.fillColor = '#ffdbc7'; // Light peach color background for Grand Total row
  
          // Apply black text color for the Grand Total row
          data.cell.styles.textColor = '#000000';
        }
      }
    });
  
    const blob = doc.output("bloburl");
    window.open(blob);
  };
  
  return (
    <div>
      <div
        onClick={handleOpen}
        className="flex border rounded-md border-gray-300 shadow p-3 max-w-3xs text-gray-800 bg-white hover:bg-gray-50 h-40"
      >
        <div className="flex justify-center items-center mr-3">
          <AssessmentRoundedIcon sx={{ color: '#f2aa83', width: 50, height: 50 }} />
        </div>
        <div>
          <p style={{ fontFamily: 'Madimi One' }}>OVERVIEW REPORT</p>
          <p className="mt-1 text-xs text-justify">
            Generates a printable file containing the overall earnings and summary within the selected date range.
          </p>
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
            OVERVIEW REPORT
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

export default OverviewModal;
