
import StoreMallDirectoryRoundedIcon from '@mui/icons-material/StoreMallDirectoryRounded';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import { logo } from '../../assets/logo64';


const branches = [
    { id: "1", branchName: "SM DAGUPAN CITY", province: "Pangasinan", city: "Dagupan", fullAddress: "M.H. Del Pilar &, Herrero Rd, Dagupan, 2400 Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
    { id: "2", branchName: "SM CITY URDANETA", province: "Pangasinan", city: "Urdaneta", fullAddress: "2nd St, Urdaneta, Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
    { id: "3", branchName: "CITYMALL SAN CARLOS", province: "Pangasinan", city: "San Carlos", fullAddress: "Bugallon St, cor Posadas St, San Carlos City, Pangasinan", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: false },
    { id: "4", branchName: "ROBINSONS PLACE LA UNION", province: "La Union", city: "San Fernando", fullAddress: "Brgy, MacArthur Hwy, San Fernando, La Union", openingTime: "07:00", closingTime: "23:00", acceptAdvancedOrder: true },
  ];

function BranchReportModal() {

   const handleGenerate = () => {
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(14);
     // Define the text you want to center
    const text = "Branches List Report";

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

    const textDescription = "List of branches along with their details.";
    const textDesWidth = doc.getStringUnitWidth(textDescription) * 10 / doc.internal.scaleFactor;

    // Calculate the x coordinate to center the text
    const xOffsetDes = (doc.internal.pageSize.width / 2) - (textDesWidth / 2);

    doc.setFontSize(10);
    doc.text(textDescription, xOffsetDes, 35);
    
    // Table headers
    const headers = ['Branch Name', 'Province', 'City', 'Address', 'Opening Time', 'Closing Time'];
    const rows = branches.map(branch => [
      branch.branchName,
      branch.province,
      branch.city,
      branch.fullAddress,
      branch.openingTime,
      branch.closingTime,
    ]);
  
    // Generate the table using autoTable
   autoTable(doc, {
      startY: 45,
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
      <div onClick={handleGenerate} className="flex border rounded-md border-gray-300 shadow p-3 max-w-3xs text-gray-800 bg-white hover:bg-gray-50  h-40">
            <div className='flex justify-center items-center mr-3'>
                <StoreMallDirectoryRoundedIcon sx={{ color: '#f2aa83', width: 50, height: 50}} />
            </div>
            <div>
                <p style={{fontFamily: "Madimi One"}}>BRANCHES LIST REPORT</p>
                <p className="mt-1 text-xs text-justify">Generates a printable file containing the list of branches</p>
            </div>
        </div>
    </div>
  );
}

export default BranchReportModal;
