import React, { useState } from 'react';
import PdfViewer from './PdfViewer';

const PDFOpener = () => {
  const [showPdf, setShowPdf] = useState(false);

  const pdfUrl = 'https://prajna-pdf.s3.ap-south-1.amazonaws.com/082e49d9-c514-441d-8cb6-bab2cafb099c_Problem+Statement.pdf';
  const pageNumber = 2;
  const highlightText = 'Develop an Intelligent PDF Querying System (IPQS)';

  const togglePdfViewer = () => {
    setShowPdf((prev) => !prev);
  };

  return (
    <div style={{ display: 'flex' }}>
      <button className="toggle-pdf-btn" onClick={togglePdfViewer}>
        {showPdf ? 'Hide PDF' : 'Show PDF'}
      </button>

      {showPdf && (
        <div className="pdf-container-wrapper">
          <PdfViewer
            pdfUrl={pdfUrl}
            pageNumber={pageNumber}
            highlightText={highlightText}
            onClose={togglePdfViewer}
          />
        </div>
      )}

      <div className="main-content">
        <h1>Your Main App Content</h1>
        <p>This is the content of your main app next to the PDF viewer.</p>
      </div>
    </div>
  );
};

export default PDFOpener;
