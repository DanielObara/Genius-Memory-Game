import '../Styles/Home.css'
import ButtonLink from './ButtonLink'

function Home() {
 
    return (
      <>
        <h1>Genius Game</h1>
        <div className='GameModes'>
        <ButtonLink buttontext='Solo Game' to='/sologame'></ButtonLink>
        <ButtonLink buttontext="1v1" to='/sologame'></ButtonLink>
        </div>
        
      </>
    )
}

export default Home