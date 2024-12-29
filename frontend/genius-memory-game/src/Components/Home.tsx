import { useEffect } from 'react';
import '../Styles/Home.css'
import ButtonLink from './ButtonLink'
import introJs from 'intro.js';
import 'intro.js/introjs.css';

function Home() {
  useEffect(() => {
    introJs().setOptions({
      steps: [
        {
          intro:  `<div style="text-align: center;">
          Bem-vindo ao Genius Game 
          <img src="/maka.gif" alt="Genius Game" style="width: 200px; height: auto;  margin-top: 20px;" />
        </div>`
        },
        {
          element: '.GameModes',
          intro: 'Escolha seu modo de jogo aqui',
        },
        {
          element: '.Link',
          intro: 'Se você for novo tente esse!',
        },
        
      ],
    }).start();
  }, []); 
    return (
      <>
      
        <h1>Genius Game</h1>
        <div className='GameModes'>
        <ButtonLink buttontext='Solo Game' to='/sologame'></ButtonLink>
        <ButtonLink buttontext="1v1" to='/'></ButtonLink>
        <ButtonLink buttontext="Co-op" to='/'></ButtonLink>
        </div>
        
      </>
    )
}

export default Home