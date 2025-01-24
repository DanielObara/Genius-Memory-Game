import { doc, setDoc, updateDoc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
//A Unsubscribe is a interface to unsub() function
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { db } from "../FireBase/firebase-config";
import '../Styles/CooperativeRoom.css'

import ButtonLink from "./ButtonLink";

interface PlayerInfos {
  player1Img: string;
  player2Img: string;
}

type RoomData = {
  player1: string;
  player1Img: string;
  player2: string;
  player2Img: string;
}

const cookies = new Cookies();
const isAuth = cookies.get("auth-token");
const userName = cookies.get("userName");
const userImg = cookies.get("userImg");

const CooperativeRoom = () => {

  const navigate = useNavigate();
  const [createRoom, setCreateRoom] = useState<string>('');
  const [playersInfos, setPlayersInfos] = useState<PlayerInfos>({ player1Img: '', player2Img: '' });

  const handleRoomData = (roomData: RoomData, unsub: Unsubscribe) => {
    setPlayersInfos({
      player1Img: roomData?.player1Img,
      player2Img: roomData?.player2Img
    });
  
    if (roomData?.player1Img && roomData?.player2Img) {
      navigateToRoomAfterTimer(unsub);
    }
  };
  
  const navigateToRoomAfterTimer = (unsub:Unsubscribe) => {
    setTimeout(() => {
      navigate(`/co-op/${createRoom}`);
      unsub();
    }, 1000);
  };
  
  const initializeRealTimeUpdates = () => {
    const unsub = onSnapshot(doc(db, "Co-op", createRoom), (doc) => {
      const roomData = doc.data() as RoomData;
      handleRoomData(roomData, unsub);
    });
  };

  const saveRoom = async () => {

    try {
      await setDoc(doc(db, "Co-op", createRoom), {
        createdBy: userName,
        player1: userName,
        player1Img: userImg,
        player2: "",
        player2Img: "",
        gameChoice: [],
        round: 1,
        currentPlayer: userName,
      });
      initializeRealTimeUpdates()

    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = async () => {
    try {
      const coopRoom = doc(db, "Co-op", createRoom);
      const roomSnap = await getDoc(coopRoom);

      if (roomSnap.exists()) {
        const roomData = roomSnap.data() as RoomData;

        if (!roomData.player2) {
          await updateDoc(coopRoom, {
            player2: userName,
            player2Img: userImg
          });
          initializeRealTimeUpdates()

        } else {
          alert("sala cheia");
        }
      } else {
        alert("Sala não encontrada");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateRoom(event.target.value);
  };

  return (
    <div>
      <h1>Cooperativo</h1>
      {isAuth ? (
        <div>
          <p>Bem-vindo, {userName}</p>
          <div className="CreateDiv">

            <input type="text" onChange={handleChange} placeholder="Nome da sala" />
            <button onClick={saveRoom}>Criar sala</button>
          </div>

          <div className="JoinDiv">
            <input type="text" onChange={handleChange} placeholder="Nome da sala" />
            <button onClick={joinRoom}>Entrar na sala</button>
          </div>

          <h2>{createRoom}</h2>
          <div className="playersInfos">
            {playersInfos.player1Img && <img src={playersInfos.player1Img} />}
            {playersInfos.player2Img && <img src={playersInfos.player2Img} />}
          </div>

        </div>
      ) : (
        <p>Faça login primeiro</p>
      )}
      <ButtonLink buttontext={'Voltar'} to={'/'} id={'BackButton'}></ButtonLink>
    </div>
  );
}

export default CooperativeRoom;
