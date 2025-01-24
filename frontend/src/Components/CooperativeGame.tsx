import { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc, 
  DocumentSnapshot, 
  DocumentReference
} from 'firebase/firestore';
import { db } from '../FireBase/firebase-config';
import Cookies from 'universal-cookie';
import { ChangeTurn } from '../Utils/ChangeTurn';
import { BackgroundColor } from '../Utils/BackgroundColor';
import ColorButtons from './ColorButtons';

//A DocumentReference refers to a document location in a Firestore database
//A DocumentSnapshot contains data read from a document in Firestore database

const cookies = new Cookies();

type RoomParams = {
  roomname: string;
};

type RoomData = {
  playersChoices: string[];
  createdBy: string;
  currentPlayer: string;
  gameChoice: string[];
  player1: string;
  player1Img: string;
  player2: string;
  player2Img: string;
  round: number;
};

type PlayersInfos = {
  player1Name: string;
  player1Img: string;
  player2Name: string;
  player2Img: string;
};

const AVAILABLE_COLORS: string[] = ['Red', 'Yellow', 'Green', 'Blue'];

const CooperativeGame = () => {
  const randomNumber = AVAILABLE_COLORS[Math.floor(4 * Math.random())]
  
  const [userName] = useState(cookies.get("userName") || "");

  const [gameChoices, setGameChoices] = useState<string[]>([]);
  const [round, setRodada] = useState(1);

  const [playersInfos, setPlayersInfos] = useState<PlayersInfos>({player1Img: '',player2Img: '',player1Name: '',player2Name: ''});
  const [currentPlayer, setCurrentPlayer] = useState<string>('');

  const { roomname } = useParams<RoomParams>();

  if (!roomname) {
    throw new Error("Room name is undefined! Ensure the route provides a valid room name.");
  }

  // ----------------------------------------------
  // Funções Auxiliares
  // ----------------------------------------------

  const syncRoomData = useCallback((roomname: string) => {
    const unsub = onSnapshot(
      doc(db, "Co-op", roomname) as DocumentReference, 
      (docSnapshot: DocumentSnapshot) => {
        const roomData = docSnapshot.data() as RoomData;

      setPlayersInfos({
        player1Img: roomData?.player1Img || '',
        player2Img: roomData?.player2Img || '',
        player1Name: roomData?.player1 || '',
        player2Name: roomData?.player2 || '',
      });

      setGameChoices(roomData?.gameChoice || []);
      setRodada(roomData?.round || 1);
      setCurrentPlayer(roomData?.currentPlayer || '');
    }
  );

    return unsub;
  }, [])

  const getRoomData = async (roomRef: DocumentReference): Promise<RoomData> => {
    const roomSnap = await getDoc(roomRef);
    return roomSnap.data() as RoomData;
  };

  const updateRoomWithNewColor = async (roomRef: DocumentReference, roomData: RoomData): Promise<void> => {
    const newColor = randomNumber
    await updateDoc(roomRef, {
      gameChoice: roomData?.gameChoice.concat(newColor),
    });
  };

  const setupSnapshotListener = (roomRef: DocumentReference): void => {
    onSnapshot(roomRef, (docSnapshot: DocumentSnapshot) => {
      const roomData = docSnapshot.data() as RoomData;
      setGameChoices(roomData?.gameChoice || []);
      setRodada(roomData?.round || 1);
      setCurrentPlayer(roomData?.currentPlayer || '');
    });
  };

  const initializeRealTimeUpdates = async () => {
    const roomRef = doc(db, "Co-op", roomname);

    try {
      const roomData = await getRoomData(roomRef);
      await updateRoomWithNewColor(roomRef, roomData);
      setupSnapshotListener(roomRef);
    } catch (error) {
      console.error(error);
    }
  };

  const flashColors = (colors: string[]): void => {
    colors.forEach((color, index) => {
      const button = document.querySelector<HTMLButtonElement>(`.${color}`)!;

      setTimeout(() => {
        button.style.backgroundColor = 'rgb(240, 240, 240)';
      }, index * 750);

      setTimeout(() => {
        button.style.backgroundColor = '';
      }, index * 750 + 600);
    });
  };

  const Sequencia = async (corEscolhidaPeloPlayer: string): Promise<void> => {
    if (userName !== currentPlayer) {
      alert('Aguarde a sua vez');
    }

    const roomRef = doc(db, "Co-op", roomname);
    const roomSnap = await getDoc(roomRef);
    const roomData = roomSnap.data() as RoomData;
    const currentPlayerChoices = roomData?.playersChoices || [];
    const correctColor = corEscolhidaPeloPlayer === gameChoices[currentPlayerChoices.length];
    const selectedColor = randomNumber

    if (correctColor) {
      BackgroundColor(true, true, 220, document.body)

      if (currentPlayerChoices.length + 1 === gameChoices.length) {
        await updateDoc(roomRef, {
          playersChoices: [],
          round: roomData?.round + 1,
          gameChoice: roomData?.gameChoice.concat(selectedColor),
        });

        ChangeTurn(roomname, 'Co-op');
      } else {
        await updateDoc(roomRef, {
          playersChoices: [...currentPlayerChoices, corEscolhidaPeloPlayer],
        });
      }
    } else {
      BackgroundColor(false,true, 220, document.body);

      await updateDoc(roomRef, {
        playersChoices: [],
        round: 1,
        gameChoice: [randomNumber],
        currentPlayer: playersInfos.player1Name,
      });
    }
  };

  // ----------------------------------------------
  // Use Effects
  // ----------------------------------------------

  useEffect(() => {
    syncRoomData(roomname);
  }, [roomname, syncRoomData]);

  useEffect(() => {
    initializeRealTimeUpdates();
  }, [roomname]);

  useEffect(() => {
    flashColors(gameChoices);
  }, [round]);

  // ----------------------------------------------
  // Render JSX
  // ----------------------------------------------

  return (
    <>
      <h1>Rodada {round}</h1>
      <h2>Turno do Player: {currentPlayer}</h2>
      {playersInfos.player1Img && <img src={playersInfos.player1Img} />}
      {playersInfos.player2Img && <img src={playersInfos.player2Img} />}
      
      <ColorButtons Sequencia={Sequencia}></ColorButtons>
    </>
  );
};

export default CooperativeGame;
