import './App.css'
import SoloGame from './Components/SoloGame'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Components/HomePage'
import Cooperative from './Components/CooperativeRoom'
import CooperativeGame from './Components/CooperativeGame'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sologame" element={<SoloGame />} />
          <Route path="/co-op" element={<Cooperative />} />
          <Route path="/co-op/:roomname" element={<CooperativeGame />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
