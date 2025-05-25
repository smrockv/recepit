import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
//import './App.css'
import ImageUpload from './ImageUpload';
import ConfigModal from './ConfigModal';
import { Box, Button, Container, createTheme, ThemeProvider, Backdrop, CircularProgress } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import {  useBackdrop } from './context/BackdropContext'; // BackdropContextをインポート

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { backdropOpen } = useBackdrop(); // BackdropContextから状態を取得

  return (
    <>
      <Container fixed>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Button variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setIsModalOpen(true)}>
            config
          </Button>
        </div>
        <Box sx={{ mt: 10 }}>
          <ImageUpload />
        </Box>
      </Container>
      <ConfigModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Backdrop コンポーネントを追加 */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default App
