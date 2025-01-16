/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
//coisas do eslint
import { useEffect, useState } from 'react'
import '../Styles/SoloGame.css'
import { useParams } from "react-router-dom";
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';
import Cookies from "universal-cookie";
import { PlayAudio } from './SoloGame';

const cookies = new Cookies();

type RoomParams = {
  roomname: string;
};

const CooperativeGame = () => {

  const coresDisponiveis = ['Vermelho', 'Amarelo', 'Verde', 'Azul'];
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [ultimaCor, setUltimaCor] = useState('')
  const [round, setRodada] = useState(1)

  const numeroAleatorio = Math.floor(4 * Math.random())
  const corSelecionada = coresDisponiveis[numeroAleatorio];
  //--------------------------------------------------------------------------------------
  const [playersInfos, setPlayersInfos] = useState({ player1Img: '', player2Img: '', player1Name: '', player2Name: '' });

  /* const [gameInfo, setGameInfo] = useState({currentPlayer: ''}); */

  const { roomname } = useParams<RoomParams>();

  useEffect(() => {
    if (!roomname) return;
    //verifica se o roomname é valido
    const unsub = onSnapshot(doc(db, "Co-op", roomname), (doc) => {
      const roomData = doc.data();

      setPlayersInfos({
        player1Img: roomData?.player1Img,
        player2Img: roomData?.player2Img,
        player1Name: roomData?.player1,
        player2Name: roomData?.player2
      })
      //vamos usar isso e a linha 31 depois 
      /* setGameInfo({
        currentPlayer: roomData?.currentPlayer
      }) */
    });

    return () => {
      unsub();
    };
  }, [roomname])

  const realTimeFireBase = async () => {
    if (!roomname) return;
    const roomRef = doc(db, "Co-op", roomname);

    try {
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data();

      await updateDoc(roomRef, {
        gameChoice: roomData?.gameChoice.concat(corSelecionada),
        lastColor: corSelecionada,
      });
      onSnapshot(roomRef, (docSnapshot) => {
        const roomData = docSnapshot.data();
       setAvailableColors(roomData?.gameChoice);
        setUltimaCor(roomData?.lastColor);
        setRodada(roomData?.round);
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    realTimeFireBase()
  }, []);

  useEffect(() => {
    for (let i = 0; i < availableColors.length; i++) {
      const piscarCores = document.querySelector<HTMLButtonElement>(`.${availableColors[i]}`)!;

      setTimeout(() => {
        piscarCores.style.backgroundColor = 'rgb(240, 240, 240)';
      }, i * 800);

      setTimeout(() => {
        piscarCores.style.backgroundColor = '';
      }, i * 800 + 600);
    }
  }, [round])

  const [userName] = useState(cookies.get("userName"));

  /* async function Sequencia(corEscolhidaPeloPlayer: string) { */
  const Sequencia = async (corEscolhidaPeloPlayer: string) => {
    if (!roomname) return;
    const roomRef = doc(db, "Co-op", roomname);
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data();
    const currentPlayerChoices = roomData?.escolhasDosPlayers || [];
    const acerto = corEscolhidaPeloPlayer === availableColors[currentPlayerChoices.length];

    if (acerto) {
      PlayAudio(correctButton);

      if (currentPlayerChoices.length + 1 === availableColors.length) {
        await updateDoc(roomRef, {
          escolhasDosPlayers: [],
          round: roomData?.round + 1,
          gameChoice: [...roomData?.gameChoice, corSelecionada],
          lastColor: corSelecionada,
          // MUDAR TURNO: 
          // currentPlayer: 
          //   roomData?.currentPlayer === playersInfos.player1Name
          //     ? playersInfos.player2Name
          //     : playersInfos.player1Name,
        });


      } else {
        //se não for a ultima cor da round e ele ter acertado..
        await updateDoc(roomRef, {
          escolhasDosPlayers: [...currentPlayerChoices, corEscolhidaPeloPlayer],
        });
      }
    } else {
      PlayAudio(incorrectButton);

      await updateDoc(roomRef, {
        escolhasDosPlayers: [],
        round: 1,
        gameChoice: [corSelecionada],
        lastColor: corSelecionada,
        currentPlayer: playersInfos.player1Name,
      });
    }
  }


  return (
    <>
      <h1>Rodada {round}</h1>
      <h2>Turno do Player {userName}</h2>
      <h2>Cor da round: {ultimaCor}</h2>
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