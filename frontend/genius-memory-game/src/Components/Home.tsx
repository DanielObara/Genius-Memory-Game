import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
 
    return (
      <>
      <h1>Genius-Game</h1>
      <Link to={'/sologame'} className="buttonText">
            Solo Mode
        </Link>
      </>
    )
}

export default Home