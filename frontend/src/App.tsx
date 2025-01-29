import './App.css'
import SoloGame from './Components/SoloGame/SoloGame'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Components/HomePage/HomePage'
import CooperativeRoom from './Components/CooperativeRoom/CooperativeRoom'
import CooperativeGame from './Components/CooperativeGame/CooperativeGame'
import BackgroundProvider from './Components/BackgroundContext/BackgroundContext'

function App() {

  return (
    <>
    <BackgroundProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sologame" element={<SoloGame />}/>
          <Route path="/co-op" element={<CooperativeRoom />} />
          <Route path="/co-op/:roomname" element={<CooperativeGame />} />
        </Routes>
      </BrowserRouter>
      </BackgroundProvider>
    </>
  )
}

export default App
