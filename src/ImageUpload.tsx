import { useState, type ChangeEvent, useEffect } from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import ImageAnalys from './ImageAnalys';

interface ImageUploadProps {
  // You can add props here if needed
}

export default function ImageUpload({ }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
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
    <div>
      <Button
        component="label"
        variant="contained"
        fullWidth
      >
        ファイルを選択
        <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
      </Button>
      {selectedFile && <Typography variant="body1">選択されたファイル: {selectedFile.name}</Typography>}
      {previewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src={previewUrl}
            alt="Image Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          />
        </Box>
      )}
      { selectedFile && <ImageAnalys selectedFile={selectedFile} /> }
    </div>
  );
};

