/* eslint-disable react-hooks/exhaustive-deps */
//coisas do eslint
import { useEffect, useState } from 'react'
import '../Styles/SoloGame.css'
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
import ButtonLink from './ButtonLink'

export function PlayAudio(audio: string) {
  new Audio(audio).play()
}

interface SoloGameState {
  gameColorChoices: string[];
  playerChoices: string[];
  round: number;
}

const SoloGame = () => {
  const availableColors = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
  const [gameColorChoices, setGameColorChoices] = useState<SoloGameState['gameColorChoices']>([]);
  const [playerChoices, setPlayerChoices] = useState<SoloGameState['playerChoices']>([]);
  const [round, setRound] = useState<SoloGameState['round']>(1);

  const randomNumber = Math.floor(4 * Math.random())
  const selectedColor = availableColors[randomNumber];

  useEffect(() => {
    setGameColorChoices(gameColorChoices.concat(selectedColor));
  }, [round])

  useEffect(() => {
    for (let i = 0; i < gameColorChoices.length; i++) {
      const flashButtonColors = document.querySelector<HTMLButtonElement>(`.${gameColorChoices[i]}`)!;

      setTimeout(() => {
        flashButtonColors.style.backgroundColor = 'rgb(240, 240, 240)';
      }, i * 750);

      setTimeout(() => {
        flashButtonColors.style.backgroundColor = '';
      }, i * 750 + 600);
    }

  }, [gameColorChoices])

  const Sequencia = async (corEscolhidaPeloPlayer: string) => {
    setPlayerChoices(playerChoices.concat(corEscolhidaPeloPlayer));
    const correctColor = corEscolhidaPeloPlayer === gameColorChoices[playerChoices.length];
    // ex: a sequencia é [ "Vermelho", "Azul", "Azul"]
    // gameColorChoices[0] é "Vermelho"
    // gameColorChoices[1] é "Azul"
    // gameColorChoices[2] é "Azul" 

    // se o jogador já escolheu a primeira cor a segunda seria:
    // corEscolhidaPeloPlayer === gameColorChoices[1] que seria "Azul"


    if (correctColor) {
      PlayAudio(correctButton)

      document.body.style.backgroundColor = 'rgb(44, 245, 44)';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 220);

      if (playerChoices.length + 1 === gameColorChoices.length) {
        //aqui precisa do + 1 já que estado playerChoices ainda não foi atualizado (não me pergunte o porque)
        setRound(round + 1);
        setPlayerChoices([]);
      }
    } else {
      PlayAudio(incorrectButton)
      document.body.style.backgroundColor = 'red';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 220);


      if (round !== 1) {
        setRound(1)
        setGameColorChoices([])
        setPlayerChoices([])
      } else {
        setRound(1)
        setGameColorChoices([gameColorChoices[0]])
        setPlayerChoices([])
      }
    }
  }
  return (
    <>
      <h1>Rodada {round}</h1>
      <div className="Buttons">
        <button className='Vermelho' onClick={() => { Sequencia('Vermelho') }}>Vermelho</button>
        <button className='Amarelo' onClick={() => { Sequencia('Amarelo') }}>Amarelo</button>
      </div>
      <div className="Buttons">
        <button className='Verde' onClick={() => { Sequencia('Verde') }}>Verde</button>
        <button className='Azul' onClick={() => { Sequencia('Azul') }}>Azul</button>
      </div>
      <ButtonLink buttontext={'Voltar'} to={'/'} id={'BackButton'}></ButtonLink>
    </>
  )
}

export default SoloGame