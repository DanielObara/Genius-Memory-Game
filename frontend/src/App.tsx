import './App.css'
import SoloGame from './Components/SoloGame'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Components/HomePage'
import CooperativeRoom from './Components/CooperativeRoom'
import CooperativeGame from './Components/CooperativeGame'
import BackgroundProvider from './Components/BackgroundContext'

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
