import { useEffect, useState } from 'react';
import '../Styles/Home.css'
import ButtonLink from './ButtonLink'
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import Auth from '../FireBase/Auth';

function Home() {

  useEffect(() => {})

  useEffect(() => {
    introJs().setOptions({
      steps: [
        {
          intro:  `<div style="text-align: center;">
          Bem-vindo ao Genius Game 
          <img src="/maka.gif" style="width: 200px; height: auto;  margin-top: 20px;" />
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
          element:'.NaoLogado',
          intro:'Para jogar os outros modos é necessario fazer login pelo google'
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
      <div className='Home'>
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