import { useState, type ChangeEvent, useEffect } from 'react';
import { Box, Button, Grid, Typography, styled } from '@mui/material';
import ImageAnalys from './ImageAnalys';
import CameraCapture from './CameraCapture';

interface ImageUploadProps {
  // You can add props here if needed
}

export default function ImageUpload({ }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  //const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleCameraCapture = (imageData: string| null) => {
    if (imageData == null) {
      return;
    }
    // Convert Base64 string back to a File object or Blob if ImageAnalys requires it
    // For now, let's just set the preview URL directly from the Base64 string
    // setSelectedFile(null);
    setPreviewUrl(imageData);
    // If ImageAnalys needs a File/Blob, you'd create it here
    // For example:
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => setSelectedFile(new File([blob], "captured-image.png", { type: "image/png" })));
    //setIsCameraModalOpen(false); // Close modal after capture
  };

  useEffect(() => {
    if (selectedFile && !previewUrl) { // Only read file if selectedFile changes and previewUrl is not already set by camera
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (!selectedFile && !previewUrl) { // Reset if neither is set
      setPreviewUrl(null);
    }
  }, [selectedFile]);

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

  return (
    <Box>
      {/* <Box sx={{ display: 'flex', gap: 2, mb: 2 }}> */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={6}>
            <Button
              component="label"
              variant="contained"
              fullWidth
              // sx={{ flexGrow: 1 }}
            >
              ファイルを選択
              <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
            </Button>
          </Grid>
          <Grid size={6}>
            <CameraCapture 
            //isOpen={isCameraModalOpen}
            //onClose={() => setIsCameraModalOpen(false)}
            onCapture={handleCameraCapture} />
          </Grid>
        </Grid>
      {/* </Box> */}
      {selectedFile && <Typography variant="body1" sx={{ mb: 2 }}>選択されたファイル: {selectedFile.name}</Typography>}
      {previewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={previewUrl}
            alt="Image Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          />
        </Box>
      )}
      {/* Pass the previewUrl directly to ImageAnalys for now */}
      {/* You might need to convert previewUrl (Base64) back to a File/Blob depending on ImageAnalys implementation */}
      {selectedFile && <ImageAnalys selectedFile={selectedFile} />}

    </Box>
  );
};

