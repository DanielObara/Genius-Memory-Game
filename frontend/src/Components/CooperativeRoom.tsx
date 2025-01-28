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
  const [isAuth] = useState(cookies.get("auth-token"));
  const [userName] = useState(cookies.get("userName"));
  const [userImg] = useState(cookies.get("userImg"));

  const [createRoom, setCreateRoom] = useState<string>("");
  const [playersInfos, setPlayersInfos] = useState<PlayerInfos>({ player1Img: "", player2Img: "" });

  const navigate = useNavigate();

  // ---------------------------
  // Funções Auxiliares
  // ---------------------------

  const updatePlayersInfo = (roomData: RoomData) => {
    setPlayersInfos({
      player1Img: roomData?.player1Img || "",
      player2Img: roomData?.player2Img || "",
    });
  };

  const navigateToRoomAfterTimer = (unsub: Unsubscribe) => {
    setTimeout(() => {
      navigate(`/co-op/${createRoom}`);
      unsub();
    }, 1000);
  };

  const initializeRealTimeUpdates = () => {
    try {
      if (!createRoom.trim()) {
        alert("Nome da sala não pode estar vazio.");
        return;
      }

      const unsub = onSnapshot(
        doc(db, "Co-op", createRoom),
        (doc) => {
          const roomData = doc.data() as RoomData;
          if (!roomData) {
            console.warn("Tentando acessar uma sala inexistente:", createRoom);
            return;
          }
          updatePlayersInfo(roomData);

          if (roomData?.player1Img && roomData?.player2Img) {
            navigateToRoomAfterTimer(unsub);
          }
        },
        (error) => {
          console.error("Erro ao escutar as atualizações da sala:", error);
          alert("Erro ao sincronizar os dados da sala. Por favor, tente novamente.");
        }
      );
    } catch (error) {
      console.error("Erro inesperado ao inicializar atualizações em tempo real:", error);
      alert("Erro inesperado ao conectar à sala. Tente novamente mais tarde.");
    }
  };

  // ---------------------------
  // Funções principais
  // ---------------------------

  const saveRoom = async () => {
    try {
      if (!createRoom.trim()) {
        alert("Nome da sala não pode estar vazio.");
        return;
      }

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

      console.log(`Sala "${createRoom}" criada com sucesso por ${userName}`);
      initializeRealTimeUpdates();
    } catch (error) {
      console.error("Erro ao criar a sala:", error);
      alert("Erro ao criar a sala. Tente novamente.");
    }
  };

  const joinRoom = async () => {
    try {
      if (!createRoom.trim()) {
        alert("Nome da sala não pode estar vazio.");
        return;
      }

      const coopRoom = doc(db, "Co-op", createRoom);
      const roomSnap = await getDoc(coopRoom);

      if (!roomSnap.exists()) {
        alert("Sala não encontrada.");
        return;
      }

      const roomData = roomSnap.data() as RoomData;

      if (!roomData.player2) {
        await updateDoc(coopRoom, {
          player2: userName,
          player2Img: userImg,
        });

        console.log(`${userName} entrou na sala "${createRoom}"`);
        initializeRealTimeUpdates();
      } else {
        alert("Sala cheia.");
      }
    } catch (error) {
      console.error("Erro ao entrar na sala:", error);
      alert("Erro ao entrar na sala. Tente novamente.");
    }
  };

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
      <ButtonLink buttontext={"Voltar"} to={"/"} id={"BackButton"} />
    </div>
  );
};

export default CooperativeRoom;
