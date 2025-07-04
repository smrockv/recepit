import { useState } from 'react'
import ImageUpload from './ImageUpload';
import ConfigModal from './ConfigModal';
import { Box, Button, Container, Backdrop, CircularProgress, Typography, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

import { useBackdrop } from './context/BackdropContext'; // BackdropContextをインポート

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { backdropOpen } = useBackdrop(); // BackdropContextから状態を取得

  return (
    <>
      <Container fixed>
        <Grid container spacing={2} sx={{ mt:2 }} justifyContent="flex-end">
          <Grid size={8}>
            <Typography variant='h4'>Recepit Scan</Typography>
          </Grid>
          <Grid size={4}>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <Button variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => setIsModalOpen(true)}>
              config
            </Button>
            </div>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
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
