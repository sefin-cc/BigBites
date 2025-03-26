import StoreMallDirectoryRoundedIcon from '@mui/icons-material/StoreMallDirectoryRounded';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { logo } from '../../assets/logo64';
import { useGetBranchesQuery } from '../../features/api/branchApi';
import { useState, useEffect } from 'react';

function BranchReportModal() {
  const { data: branches, isLoading } = useGetBranchesQuery();
  const [isReady, setIsReady] = useState(false);

  // ✅ Wait until data is fully loaded before allowing PDF generation
  useEffect(() => {
    if (!isLoading && branches) {
      setIsReady(true);
    }
  }, [isLoading, branches]);

  const handleGenerate = () => {
    if (isReady) {
      generatePDF();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(14);
    const title = "Branches List Report";
    const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
    const xTitle = (doc.internal.pageSize.width / 2) - (titleWidth / 2);
    doc.text(title, xTitle, 27);

    // Logo
    const imgWidth = 14;
    const imgHeight = 11;
    const xImg = (doc.internal.pageSize.width / 2) - (imgWidth / 2);
    doc.addImage(logo, 'PNG', xImg, 10, imgWidth, imgHeight);

    // Description
    doc.setFontSize(10);

    const textDescription = "List of branches along with their details.";
    const textDesWidth = doc.getStringUnitWidth(textDescription) * 10 / doc.internal.scaleFactor;
    const xOffsetDes = (doc.internal.pageSize.width / 2) - (textDesWidth / 2);
    doc.text(textDescription, xOffsetDes, 35);

    // Table Headers
    const headers = [['Branch Name', 'Province', 'City', 'Address', 'Opening Time', 'Closing Time']];
    const rows = branches?.map(branch => [
      branch.branchName,
      branch.province,
      branch.city,
      branch.fullAddress,
      branch.openingTime,
      branch.closingTime,
    ]);

    // Generate Table
    autoTable(doc, {
      startY: 45,
      head: headers,
      body: rows,
      theme: 'striped',
      margin: { top: 10 },
      headStyles: { fillColor: "#FB7F3B", fontStyle: 'bold' },
      styles: { fontSize: 9 },
    });

    // Open PDF in a new tab
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl);
  };

  return (
    <div>
      <div 
        onClick={isReady ? handleGenerate : undefined} 
        className={`flex border rounded-md border-gray-300 shadow p-3 max-w-3xs text-gray-800 bg-white ${isReady ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'} h-40`}
      >
        <div className='flex justify-center items-center mr-3'>
          <StoreMallDirectoryRoundedIcon sx={{ color: '#f2aa83', width: 50, height: 50 }} />
        </div>
        <div>
          <p style={{ fontFamily: "Madimi One" }}>BRANCHES LIST REPORT</p>
          <p className="mt-1 text-xs text-justify">
            {isReady ? "Generates a printable file containing the list of branches" : "Loading branches... Please wait."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BranchReportModal;
