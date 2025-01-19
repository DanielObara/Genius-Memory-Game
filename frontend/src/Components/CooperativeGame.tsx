/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unsafe-optional-chaining */
//coisas do eslint
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';
import Cookies from 'universal-cookie';
import { ChangeTurn } from '../Utils/ChangeTurn';
import { BackgroundColor } from '../Utils/BackgroundColor';

const cookies = new Cookies();

type RoomParams = {
  roomname: string;
};

const CooperativeGame = () => {
  const [userName] = useState(cookies.get("userName"));

  const availableColors = ['Red', 'Yellow', 'Green', 'Blue'];
  const [gameChoices, setGameChoices] = useState<string[]>([])
  const [round, setRodada] = useState(1)

  const numeroAleatorio = Math.floor(4 * Math.random())
  const corSelecionada = availableColors[numeroAleatorio];
  //--------------------------------------------------------------------------------------
  const [playersInfos, setPlayersInfos] = useState({ player1Img: '', player2Img: '', player1Name: '', player2Name: '' });
  const [currentPlayer, setCurrentPlayer] = useState<string>('');

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
      });
      onSnapshot(roomRef, (docSnapshot) => {
        const roomData = docSnapshot.data();
       setGameChoices(roomData?.gameChoice);
        setRodada(roomData?.round);
        setCurrentPlayer(roomData?.currentPlayer);
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    realTimeFireBase()
  }, []);

  useEffect(() => {
    for (let i = 0; i < gameChoices.length; i++) {
      const piscarCores = document.querySelector<HTMLButtonElement>(`.${gameChoices[i]}`)!;

      setTimeout(() => {
        piscarCores.style.backgroundColor = 'rgb(240, 240, 240)';
      }, i * 750);

      setTimeout(() => {
        piscarCores.style.backgroundColor = '';
      }, i * 750 + 600);
    }
  }, [round])

  const Sequencia = async (corEscolhidaPeloPlayer: string) => {

    if (userName !== currentPlayer) {
      alert('Aguarde a sua vez')
      return;
    }

    if (!roomname) return;
    const roomRef = doc(db, "Co-op", roomname);
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data();
    const currentPlayerChoices = roomData?.escolhasDosPlayers || [];
    const correctColor = corEscolhidaPeloPlayer === gameChoices[currentPlayerChoices.length];

    if (correctColor) {
      BackgroundColor(true)

      if (currentPlayerChoices.length + 1 === gameChoices.length) {
        await updateDoc(roomRef, {
          escolhasDosPlayers: [],
          round: roomData?.round + 1,
          gameChoice: [...roomData?.gameChoice, corSelecionada],
        });
        
        ChangeTurn(roomname, 'Co-op');

      } else {
        //se não for a ultima cor da round e ele ter acertado..
        await updateDoc(roomRef, {
          escolhasDosPlayers: [...currentPlayerChoices, corEscolhidaPeloPlayer],
        });
      }
    } else {
      BackgroundColor(false)

      await updateDoc(roomRef, {
        escolhasDosPlayers: [],
        round: 1,
        gameChoice: [corSelecionada],
        currentPlayer: playersInfos.player1Name,
      });
    }
  }

  return (
    <>
      <h1>Rodada {round}</h1>
      <h2>Turno do Player: {currentPlayer}</h2>
      {playersInfos.player1Img && <img src={playersInfos.player1Img} />}
      {playersInfos.player2Img && <img src={playersInfos.player2Img} />}
      
      <div className="Buttons">
        <button className='Red' onClick={() => { Sequencia('Red') }}>Red</button>
        <button className='Yellow' onClick={() => { Sequencia('Yellow') }}>Yellow</button>
      </div>
      <div className="Buttons">
        <button className='Green' onClick={() => { Sequencia('Green') }}>Green</button>
        <button className='Blue' onClick={() => { Sequencia('Blue') }}>Blue</button>
      </div>

    </>
  )
}

export default CooperativeGame;