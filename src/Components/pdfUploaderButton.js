import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

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

export default function InputFileUpload() {
  const handleFileUpload = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const formData = new FormData();

      // Append each selected file to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
      }

      try {
        // Send the FormData to the backend using axios
        const response = await axios.post('https://prajna-ai.onrender.com/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Upload success:', response.data);
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload PDF files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileUpload}
        multiple
        accept="application/pdf" // Only accept PDF files
      />
    </Button>
  );
}
