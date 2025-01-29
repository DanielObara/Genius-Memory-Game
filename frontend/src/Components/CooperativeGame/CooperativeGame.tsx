import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { onSnapshot, doc, updateDoc, getDoc, DocumentSnapshot, DocumentReference} from 'firebase/firestore';
import { db } from '../../FireBase/firebase-config';
import Cookies from 'universal-cookie';
import { ChangeTurn } from '../../Utils/ChangeTurn';
import ColorButtons from '../ColorButtons/ColorButtons';
import { useBackground } from '../BackgroundContext/BackgroundContext';
import { PlayersInfos, RoomParams, RoomData } from './CooperativeGameTypes';

//A DocumentReference refers to a document location in a Firestore database
//A DocumentSnapshot contains data read from a document in Firestore database

const cookies = new Cookies();

const AVAILABLE_COLORS: string[] = ['Red', 'Yellow', 'Green', 'Blue'];

const CooperativeGame = () => {
  const randomNumber = AVAILABLE_COLORS[Math.floor(4 * Math.random())];

  const [userName] = useState(cookies.get("userName") || "");
  const [gameChoices, setGameChoices] = useState<string[]>([]);
  const [round, setRodada] = useState(1);

  const [playersInfos, setPlayersInfos] = useState<PlayersInfos>({player1Img: '',player2Img: '',player1Name: '', player2Name: ''});
  const [currentPlayer, setCurrentPlayer] = useState<string>('');

  const { roomname } = useParams<RoomParams>();

  if (!roomname) {
    throw new Error("Room name is undefined! Ensure the route provides a valid room name.");
  }

  const syncRoomData = (roomname: string) => {
    try {
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
          setRodada(roomData?.round);
          setCurrentPlayer(roomData?.currentPlayer || '');
        })

      return unsub

    } catch (error) {
      console.error("Error in syncRoomData:", error);
      alert("An unexpected error occurred while syncing room data.");
    }
  };

  const setupSnapshotListener = (roomRef: DocumentReference): void => {
    try {
      onSnapshot(roomRef, (docSnapshot: DocumentSnapshot) => {
        const roomData = docSnapshot.data() as RoomData;
        setGameChoices(roomData?.gameChoice || []);
        setRodada(roomData?.round || 1);
        setCurrentPlayer(roomData?.currentPlayer || '');
      }, 
      (error) => {
        console.error("Error setting up snapshot listener:", error);
        alert("Failed to set up real-time updates.");
      });
    } catch (error) {
      console.error("Error in setupSnapshotListener:", error);
      alert("An unexpected error occurred while setting up updates.");
    }
  };

  const initializeRealTimeUpdates = async () => {
    const roomRef = doc(db, "Co-op", roomname);
  
    try {
      setupSnapshotListener(roomRef);
    } catch (error) {
      console.error("Error initializing real-time updates:", error);
      alert("Failed to initialize real-time updates. Please try again.");
    }
  };

  const flashColors = (colors: string[]): void => {
    try {
      colors.forEach((color, index) => {
        const button = document.querySelector<HTMLButtonElement>(`.${color}`)!;

        setTimeout(() => {
          button.style.backgroundColor = 'rgb(240, 240, 240)';
        }, index * 750);

        setTimeout(() => {
          button.style.backgroundColor = '';
        }, index * 750 + 600);
      });
    } catch (error) {
      console.error("Error flashing colors:", error);
    }
  };

  const { setFlashClass } = useBackground(); // Use o contexto
  const Sequencia = async (corEscolhidaPeloPlayer: string): Promise<void> => {
    try {
      if (userName !== currentPlayer) {
        alert('Aguarde a sua vez');
        return;
      }

      const roomRef = doc(db, "Co-op", roomname);
      const roomSnap = await getDoc(roomRef);
      const roomData = roomSnap.data() as RoomData;

      const currentPlayerChoices = roomData?.playersChoices || [];
      const correctColor = corEscolhidaPeloPlayer === gameChoices[currentPlayerChoices.length];
      const selectedColor = randomNumber;

      if (correctColor) {
        setFlashClass('flash-green');
        setTimeout(() => setFlashClass(''), 150);

        if (currentPlayerChoices.length + 1 === gameChoices.length) {
          await updateDoc(roomRef, {
            playersChoices: [],
            round: roomData?.round + 1,
            gameChoice: roomData?.gameChoice.concat(selectedColor),
          });
            
          ChangeTurn(roomname, 'Co-op');
          setFlashClass('flash-pink');
          setTimeout(() => setFlashClass(''), 150);
        } else {
          await updateDoc(roomRef, {
            playersChoices: [...currentPlayerChoices, corEscolhidaPeloPlayer],
          });
        }
      } else {
        setFlashClass('flash-red');
        setTimeout(() => setFlashClass(''), 150);

        await updateDoc(roomRef, {
          playersChoices: [],
          round: 1,
          gameChoice: [randomNumber],
          currentPlayer: playersInfos.player1Name,
        });
      }
    } catch (error) {
      console.error("Error in Sequencia function:", error);
      alert("An error occurred while processing your move. Please try again.");
    }
  };

  // ----------------------------------------------
  // Use Effects
  // ----------------------------------------------

  useEffect(() => {
    syncRoomData(roomname);
    initializeRealTimeUpdates();
  }, []);

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
      <ColorButtons Sequencia={Sequencia} />
    </>
  );
};

export default CooperativeGame;