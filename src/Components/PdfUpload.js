import * as React from 'react';
import "../Style/pdfUpload.css";
import axios from 'axios';
import { useState } from 'react';

function PdfUpload() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
      }

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setIsSubmitted(true);
        }

        console.log('Upload success:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  return (
    <div className="upload-container">
      <label htmlFor="file-upload" className="custom-file-upload">
        <i className="upload-icon">&#8682;</i>  {/* Simple upload icon */}
        {!isSubmitted ? 'Upload PDF files' : 'PDF Files Uploaded'}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        multiple
        accept="application/pdf"
      />

      {isSubmitted && <p className='pdf-p'>The PDF has been uploaded</p>}
      <div className="recommended-questions">
        <h3>Recommended Questions</h3>
        <ul>
          <li>How to merge multiple PDFs?</li>
          <li>How can I compress a large PDF file?</li>
          <li>What is the best way to extract text from PDFs?</li>
          <li>How do I convert PDF to Word?</li>
        </ul>
      </div>
    </div>
  );
}

export default PdfUpload;
