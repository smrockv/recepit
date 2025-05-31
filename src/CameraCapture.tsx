import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';

interface CameraCaptureProps {
  onCapture: (imageData: string | null) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // Adjust width as needed
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      // Handle error, e.g., show a message to the user
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageData = canvasRef.current.toDataURL('image/png'); // Or 'image/jpeg'
        onCapture(imageData);
        handleClose();
      }
    }
  };

  useEffect(() => {
    if (open) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        カメラ
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="camera-modal-title"
        aria-describedby="camera-modal-description"
      >
        <Box sx={style}>
          <Typography id="camera-modal-title" variant="h6" component="h2">
            カメラで撮影
          </Typography>
          <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', maxWidth: '100%' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} /> {/* Hidden canvas for capture */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" onClick={captureImage}>
              取り込む
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              キャンセル
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CameraCapture;