import  { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';

interface ConfigModalProps {
  open: boolean;
  onClose: () => void;
}

function ConfigModal({ open, onClose }: ConfigModalProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [postUrl, setPostUrl] = useState<string>('');

  // モーダルが開かれたときにローカルストレージから値を読み込む
  useEffect(() => {
    if (open) {
      setApiKey(localStorage.getItem('geminiApiKey') || '');
      setPostUrl(localStorage.getItem('postUrl') || '');
    }
  }, [open]); // openが変更されたときにエフェクトを実行

  const handleConfirm = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    localStorage.setItem('postUrl', postUrl);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#252525',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Gemini API Key</Typography>
        <TextField
          label="Enter API Key"
          variant="outlined"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Typography variant="h6" >POST URL</Typography>
        <TextField
          label="Enter Post URL"
          variant="outlined"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
        />
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfigModal;
