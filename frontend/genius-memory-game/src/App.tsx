import { SetStateAction, useEffect, useState } from 'react'

import './App.css'
import SoloGame from './Components/SoloGame'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sologame" element={<SoloGame />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
