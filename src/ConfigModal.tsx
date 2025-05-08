import React, { useState, useEffect } from 'react';
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
  const [apiKey, setApiKey] = useState<string>(''); // ステートの初期値を空文字列に設定

  // モーダルが開かれたときにローカルストレージから値を読み込む
  useEffect(() => {
    if (open) {
      setApiKey(localStorage.getItem('geminiApiKey') || '');
    }
  }, [open]); // openが変更されたときにエフェクトを実行

  const handleConfirm = () => {
    localStorage.setItem('geminiApiKey', apiKey);
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
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'black' }}>Gemini API Key</Typography>
        <TextField
          label="Enter API Key"
          variant="outlined"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfigModal;