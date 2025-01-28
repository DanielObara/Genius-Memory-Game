import { doc, setDoc, updateDoc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { db } from "../FireBase/firebase-config";
import "../Styles/CooperativeRoom.css";

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
};

const cookies = new Cookies();

const CooperativeRoom = () => {
  // Estado do usuário autenticado e suas informações
  const [isAuth] = useState(cookies.get("auth-token"));
  const [userName] = useState(cookies.get("userName"));
  const [userImg] = useState(cookies.get("userImg"));

  // Estado para a sala
  const [createRoom, setCreateRoom] = useState<string>("");
  const [playersInfos, setPlayersInfos] = useState<PlayerInfos>({ player1Img: "", player2Img: "" });

  const navigate = useNavigate();

  // ---------------------------
  // Funções Auxiliares
  // ---------------------------

  /** Atualiza as informações dos jogadores */
  const updatePlayersInfo = (roomData: RoomData) => {
    setPlayersInfos({
      player1Img: roomData?.player1Img,
      player2Img: roomData?.player2Img,
    });
  };

  /** Redireciona para a sala após um tempo */
  const navigateToRoomAfterTimer = (unsub: Unsubscribe) => {
    setTimeout(() => {
      navigate(`/co-op/${createRoom}`);
      unsub();
    }, 1000);
  };

  /** Configura o ouvinte em tempo real para as informações da sala */
  const initializeRealTimeUpdates = () => {
    const unsub = onSnapshot(doc(db, "Co-op", createRoom), (doc) => {
      const roomData = doc.data() as RoomData;
      updatePlayersInfo(roomData);

      if (roomData?.player1Img && roomData?.player2Img) {
        navigateToRoomAfterTimer(unsub);
      }
    });
  };

  // ---------------------------
  // Funções principais
  // ---------------------------

  /** Cria uma nova sala no banco de dados */
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
      initializeRealTimeUpdates();
    } catch (error) {
      console.error("Erro ao criar a sala:", error);
      alert("Erro ao criar a sala. Tente novamente.");
    }
  };

  /** Tenta entrar em uma sala existente */
  const joinRoom = async () => {
    try {
      const coopRoom = doc(db, "Co-op", createRoom);
      const roomSnap = await getDoc(coopRoom);

      if (!roomSnap.exists()) {
        alert("Sala não encontrada");
        return;
      }

      const roomData = roomSnap.data() as RoomData;

      if (!roomData.player2) {
        await updateDoc(coopRoom, {
          player2: userName,
          player2Img: userImg,
        });
        initializeRealTimeUpdates();
      } else {
        alert("Sala cheia");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      alert("Erro ao entrar na sala. Tente novamente.");
    }
  };

  /** Atualiza o nome da sala no estado */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCreateRoom(event.target.value);
  };

  // ---------------------------
  // Renderização
  // ---------------------------

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
      <ButtonLink buttontext={"Voltar"} to={"/"} id={"BackButton"}></ButtonLink>
    </div>
  );
};

export default CooperativeRoom;
