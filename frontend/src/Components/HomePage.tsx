import { useEffect } from 'react';
import '../Styles/HomePage.css'
import ButtonLink from './ButtonLink'
import introJs from 'intro.js';
import '../Styles/GameButton.css'
import 'intro.js/introjs.css';
import Auth from '../FireBase/AuthComponent';

const Home = () => {

  useEffect(() => {
    introJs().setOptions({
      steps: [
        {
          intro: `<div style="text-align: center;">
          Bem-vindo ao Genius Game 
          <img src="/maka.gif" class='gif' />
        </div>`
        },
        {
          element: '.GameModes',
          intro: 'Escolha seu modo de jogo aqui',
        },
        {
          element: '#Solo-Game',
          intro: 'Nesse modo de jogo é igual aos tradicionais',
        },
        {
          element: '.NaoLogado',
          intro: 'Para jogar os outros modos é necessario fazer login pelo google'
        },
        {
          element: '#One-vs-One',
          intro: 'Nesse modo você pode desafiar outras pessoas',
        },
        {
          element: '#Co-op',
          intro: 'Nesse modo você e outro jogador revezam os rounds',
        },

      ],
    }).start();
  }, []);

  return (
    <div className='HomePage'>
      <Auth></Auth>
      <h1>Genius Game</h1>
      <div className='GameModes'>
        <ButtonLink buttontext="Solo Game" to="/sologame" id="Solo-Game" />
        <ButtonLink buttontext="1 vs 1" to="/" id="One-vs-One" />
        <ButtonLink buttontext="Co-op" to="/co-op" id="Co-op" />
      </div>

    </div>
  )
}

export default Home