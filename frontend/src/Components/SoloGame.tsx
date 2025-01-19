import { useEffect, useState } from 'react'
import ButtonLink from './ButtonLink'
import { BackgroundColor } from '../Utils/BackgroundColor';

interface SoloGameState {
  gameColorChoices: string[];
  playerChoices: string[];
  round: number;
}

const SoloGame = () => {
  const availableColors = ['Red', 'Yellow', 'Green', 'Blue'];
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
    // ex: a sequencia é [ "Red", "Blue", "Blue"]
    // gameColorChoices[0] é "Red"
    // gameColorChoices[1] é "Blue"
    // gameColorChoices[2] é "Blue" 

    // se o jogador já escolheu a primeira cor a segunda seria:
    // corEscolhidaPeloPlayer === gameColorChoices[1] que seria "Blue"


    if (correctColor) {
      BackgroundColor(true)

      if (playerChoices.length + 1 === gameColorChoices.length) {
        //aqui precisa do + 1 já que estado playerChoices ainda não foi atualizado (não me pergunte o porque)
        setRound(round + 1);
        setPlayerChoices([]);
      }
    } else {
      BackgroundColor(false)

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
        <button className='Red' onClick={() => { Sequencia('Red') }}>Red</button>
        <button className='Yellow' onClick={() => { Sequencia('Yellow') }}>Yellow</button>
      </div>
      <div className="Buttons">
        <button className='Green' onClick={() => { Sequencia('Green') }}>Green</button>
        <button className='Blue' onClick={() => { Sequencia('Blue') }}>Blue</button>
      </div>
      <ButtonLink buttontext={'Voltar'} to={'/'} id={'BackButton'}></ButtonLink>
    </>
  )
}

export default SoloGame