import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import ImageUpload from './ImageUpload';
import ConfigModal from './ConfigModal';
import { Button } from '@mui/material';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div>
        {/* <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p> */}
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Button variant="contained" onClick={() => setIsModalOpen(true)}>
            コンフィグ
          </Button>
        </div>
        <div style={{ marginTop: 50 }}> {/* Add margin top to prevent content from being hidden behind the button */}
          <ImageUpload />
        </div>
      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <ConfigModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default App
