import { useEffect, useState } from 'react'
import '../Styles/SoloGame.css'
import { useParams } from "react-router-dom";
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';

function CooperativeGame() {

  const coresDisponiveis = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
  const [cores, setCores] = useState<string[]>([])
  const [ultimaCor, setUltimaCor] = useState('')
  const [escolhasDoPlayer, setEscolhasDoPlayer] = useState<string[]>([]);
  var [rodada, setRodada] = useState(1)

  var numeroAleatorio = Math.floor(4 * Math.random())
  const corSelecionada = coresDisponiveis[numeroAleatorio];
//--------------------------------------------------------------------------------------
  const [playersInfos, setPlayersInfos] = useState({player1Img:'', player2Img:''});
  const { roomname }:any = useParams();

  function TocarAudio(audio:string) {
    new Audio(audio).play()
  }

  /* function checkPlayers() {
    const unsub = onSnapshot(doc(db, "Co-op", roomname), (doc) => {

        const roomData = doc.data();
        console.log(doc.data());

        setPlayersInfos({
            player1Img: roomData?.player1Img,
            player2Img: roomData?.player2Img
        })
     });
     unsub()
  } */
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Co-op", roomname), (doc) => {

        const roomData = doc.data();
        console.log(doc.data());

        setPlayersInfos({
            player1Img: roomData?.player1Img,
            player2Img: roomData?.player2Img
        })
     });
     return () => {
        unsub();
      };
  }, [roomname])
  
  //checkPlayers()
  
  useEffect(() => {
    console.log(numeroAleatorio);
    
    setCores(cores.concat(corSelecionada));
    setUltimaCor(corSelecionada)
    
  }, [rodada])

  
  useEffect(() => {
    for (let i = 0; i < cores.length; i++) {
      const piscarCores = document.querySelector<HTMLButtonElement>(`.${cores[i]}`)!;
      
      setTimeout(() => {
        piscarCores.style.backgroundColor = 'rgb(240, 240, 240)';
      }, i* 800);
  
      setTimeout(() => {
          piscarCores.style.backgroundColor = '';
      }, i * 800 + 600); 
    }
    
  }, [cores])
  
  function Sequencia(corEscolhidaPeloPlayer: string) {
    setEscolhasDoPlayer(escolhasDoPlayer.concat(corEscolhidaPeloPlayer));
    const acerto = corEscolhidaPeloPlayer === cores[escolhasDoPlayer.length];
    // ex: a sequencia é [ "Vermelho", "Azul", "Azul"]
    // cores[0] é "Vermelho"
    // cores[1] é "Azul"
    // cores[2] é "Azul" 

    // se o jogador já escolheu a primeira cor a segunda seria:
    // corEscolhidaPeloPlayer === cores[1] que seria "Azul"
    

    if (acerto) {
      TocarAudio(correctButton)

      document.body.style.backgroundColor = 'rgb(44, 245, 44)';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 220);
      
      if (escolhasDoPlayer.length + 1 === cores.length) {
        //aqui precisa do + 1 já que estado escolhasDoPlayer ainda não foi atualizado (não me pergunte o porque)
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
  console.log(escolhasDoPlayer.length);
  console.log(cores.length);
  return (
    <>
      <h1>Rodada {rodada}</h1>
      <h2>Cor da rodada: {ultimaCor}</h2>
      {playersInfos.player1Img && <img src={playersInfos.player1Img}/>}
      {playersInfos.player2Img && <img src={playersInfos.player2Img}/>}
      <div className="Buttons">
        <button className='Vermelho' onClick={() => { Sequencia('Vermelho') }}>Vermelho</button>
        <button className='Amarelo' onClick={() => { Sequencia('Amarelo') }}>Amarelo</button>
      </div>
      <div className="Buttons">
        <button className='Verde' onClick={() => { Sequencia('Verde') }}>Verde</button>
        <button className='Azul' onClick={() => { Sequencia('Azul') }}>Azul</button>
      </div>

    </>
  )
}

export default CooperativeGame;
