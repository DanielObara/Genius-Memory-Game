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
    setGameColorChoices((prevChoices) => [...prevChoices, selectedColor]);
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
    // ex: the sequence is [ "Red", "Blue", "Blue"]
    // gameColorChoices[0] is "Red"
    // gameColorChoices[1] is "Blue"
    // gameColorChoices[2] is "Blue" 

    // If the player has already chosen the first color, the second would be:
    // corEscolhidaPeloPlayer === gameColorChoices[1] that would be "Blue"


    if (correctColor) {
      BackgroundColor(true, 230)

      if (playerChoices.length + 1 === gameColorChoices.length) {
        setRound(round + 1);
        setPlayerChoices([]);
      }
    } else {
      BackgroundColor(false, 230)

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