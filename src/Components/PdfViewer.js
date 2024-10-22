import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import '../Style/PDFViewer.css';
import 'pdfjs-dist/build/pdf.worker.entry';
// Set the PDF worker source globally
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfUrl, pageNumber, highlightText, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null); // Clear any errors
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF.');
  };

  return (
    <div className="pdf-container-wrapper">
      <button className="pdf-close-btn" onClick={onClose}>
        Close
      </button>

      {error ? (
        <p>{error}</p>
      ) : (
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
        >
          <Page
            pageNumber={pageNumber}
            customTextRenderer={(textItem) =>
              textItem.str.includes(highlightText) ? (
                <mark>{textItem.str}</mark>
              ) : (
                textItem.str
              )
            }
          />
        </Document>
      )}
    </div>
  );
};

export default PdfViewer;
