import { useEffect, useState } from 'react'
import '../Styles/SoloGame.css'
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
function SoloGame() {

  const coresDisponiveis = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
  const [cores, setCores] = useState<string[]>([])
  const [ultimaCor, setUltimaCor] = useState('')
  const [escolhasDoPlayer, setEscolhasDoPlayer] = useState<string[]>([]);
  var [rodada, setRodada] = useState(1)

  var numeroAleatorio = Math.floor(4 * Math.random())
  const corSelecionada = coresDisponiveis[numeroAleatorio];

  function TocarAudio(audio:string) {
    new Audio(audio).play()
  }

  useEffect(() => {
    console.log(numeroAleatorio);
    setCores(cores.concat(corSelecionada));
    setUltimaCor(corSelecionada)
  }, [rodada])

  console.log(cores);

  function Sequencia(corEscolhidaPeloPlayer: string) {
    setEscolhasDoPlayer(escolhasDoPlayer.concat(corEscolhidaPeloPlayer));
    const acerto = corEscolhidaPeloPlayer === cores[escolhasDoPlayer.length];
    console.log(escolhasDoPlayer);

    if (acerto) {
      TocarAudio(correctButton)

      document.body.style.backgroundColor = 'rgb(44, 245, 44)';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 220);
      
      if (escolhasDoPlayer.length + 1 === cores.length) {
        
        setRodada(rodada + 1);
        setEscolhasDoPlayer([]);
      }
    } else {
      TocarAudio(incorrectButton)
      document.body.style.backgroundColor = 'red';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 220);
      
      
      if (rodada !== 1) {
        setRodada(1)
        setCores([])
        setEscolhasDoPlayer([])
      } else {
        setRodada(1)
        setCores([cores[0]])
        setEscolhasDoPlayer([])
      }
    }
  }

  return (
    <>
      <h1>Rodada {rodada}</h1>
      <h2>Sequencia das cores: {cores.join(' ')}</h2>
      <h2>Cor da rodada: {ultimaCor}</h2>
      <div className="Buttons">
        <button className='Red' onClick={() => { Sequencia('Vermelho') }}>Vermelho</button>
        <button className='Yellow' onClick={() => { Sequencia('Amarelo') }}>Amarelo</button>
      </div>
      <div className="Buttons">
        <button className='Green' onClick={() => { Sequencia('Verde') }}>Verde</button>
        <button className='Blue' onClick={() => { Sequencia('Azul') }}>Azul</button>
      </div>

    </>
  )
}

export default SoloGame