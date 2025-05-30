import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material';
//import './index.css'
import CssBaseline from '@mui/material/CssBaseline';
import { BackdropProvider } from './context/BackdropContext'; // BackdropContextをインポート
import App from './App.tsx'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFA500', // オレンジ色
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: 'primary', // デフォルトのボタンの色をprimaryに設定
      },
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <BackdropProvider>
        <CssBaseline />
        <App />
      </BackdropProvider>
    </ThemeProvider>
  </StrictMode>
)
