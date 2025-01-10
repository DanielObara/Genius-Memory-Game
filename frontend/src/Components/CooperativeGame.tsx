import { useEffect, useState } from 'react'
import '../Styles/SoloGame.css'
import { useParams } from "react-router-dom";
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';
import Cookies from "universal-cookie";

const cookies = new Cookies();

const CooperativeGame = () => {

  const coresDisponiveis = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
  const [cores, setCores] = useState<string[]>([])
  const [ultimaCor, setUltimaCor] = useState('')
  var [rodada, setRodada] = useState(1)

  var numeroAleatorio = Math.floor(4 * Math.random())
  const corSelecionada = coresDisponiveis[numeroAleatorio];
  //--------------------------------------------------------------------------------------
  const [playersInfos, setPlayersInfos] = useState({ player1Img: '', player2Img: '', player1Name: '', player2Name: '' });


  /* const [gameInfo, setGameInfo] = useState({currentPlayer: ''}); */

  const { roomname }: any = useParams();

  function TocarAudio(audio: string) {
    new Audio(audio).play()
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Co-op", roomname), (doc) => {
      const roomData = doc.data();

      setPlayersInfos({
        player1Img: roomData?.player1Img,
        player2Img: roomData?.player2Img,
        player1Name: roomData?.player1,
        player2Name: roomData?.player2
      })
      //vamos usar isso e a linha 25 depois 
      /* setGameInfo({
        currentPlayer: roomData?.currentPlayer
      }) */
    });

    return () => {
      unsub();
    };
  }, [roomname])

  const realTimeFireBase = async () => {
    const roomRef = doc(db, "Co-op", roomname);

    try {
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      await updateDoc(roomRef, {
        gameChoice: roomData?.gameChoice.concat(corSelecionada),
        lastColor: corSelecionada,
      });
      //const unsub = onSnapshot(roomRef, (docSnapshot) => {
      onSnapshot(roomRef, (docSnapshot) => {
        const roomData = docSnapshot.data();
        setCores(roomData?.gameChoice);
        setUltimaCor(roomData?.lastColor);
        setRodada(roomData?.rodada);
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    realTimeFireBase()
  }, []);

  useEffect(() => {
    for (let i = 0; i < cores.length; i++) {
      const piscarCores = document.querySelector<HTMLButtonElement>(`.${cores[i]}`)!;

      setTimeout(() => {
        piscarCores.style.backgroundColor = 'rgb(240, 240, 240)';
      }, i * 800);

      setTimeout(() => {
        piscarCores.style.backgroundColor = '';
      }, i * 800 + 600);
    }
  }, [rodada])

  const [userName] = useState(cookies.get("userName"));

  /* async function Sequencia(corEscolhidaPeloPlayer: string) { */
  const Sequencia = async (corEscolhidaPeloPlayer: string) => {
    const roomRef = doc(db, "Co-op", roomname);
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data();
    const currentPlayerChoices = roomData?.escolhasDosPlayers || [];
    const acerto = corEscolhidaPeloPlayer === cores[currentPlayerChoices.length];

    if (acerto) {
      TocarAudio(correctButton);

      if (currentPlayerChoices.length + 1 === cores.length) {
        await updateDoc(roomRef, {
          escolhasDosPlayers: [],
          rodada: roomData?.rodada + 1,
          gameChoice: [...roomData?.gameChoice, corSelecionada],
          lastColor: corSelecionada,
          // MUDAR TURNO: 
          // currentPlayer: 
          //   roomData?.currentPlayer === playersInfos.player1Name
          //     ? playersInfos.player2Name
          //     : playersInfos.player1Name,
        });




      } else {
        //se não for a ultima cor da rodada e ele ter acertado..
        await updateDoc(roomRef, {
          escolhasDosPlayers: [...currentPlayerChoices, corEscolhidaPeloPlayer],
        });
      }
    } else {
      TocarAudio(incorrectButton);

      await updateDoc(roomRef, {
        escolhasDosPlayers: [],
        rodada: 1,
        gameChoice: [corSelecionada],
        lastColor: corSelecionada,
        currentPlayer: playersInfos.player1Name,
      });
    }
  }


  return (
    <>
      <h1>Rodada {rodada}</h1>
      <h2>Turno do Player {userName}</h2>
      <h2>Cor da rodada: {ultimaCor}</h2>
      {playersInfos.player1Img && <img src={playersInfos.player1Img} />}
      {playersInfos.player2Img && <img src={playersInfos.player2Img} />}
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