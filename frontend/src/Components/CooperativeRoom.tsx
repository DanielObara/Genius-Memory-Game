import { doc, setDoc, updateDoc, getDoc, onSnapshot} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { db } from "../FireBase/firebase-config";
import '../Styles/CooperativeRoom.css'

import ButtonLink from "./ButtonLink";

const cookies = new Cookies();

function CooperativeRoom() {
  const [isAuth] = useState(cookies.get("auth-token"));
  const [userName] = useState(cookies.get("userName"));
  const [userImg] = useState(cookies.get("userImg"));
  
  const [createRoom, setCreateRoom] = useState("");
  const navigate = useNavigate(); 

  const [playersInfos, setPlayersInfos] = useState({player1Img:'', player2Img:''});
  
function realTime() {
  const unsub = onSnapshot(doc(db, "Co-op", createRoom), (doc) => {

    const roomData = doc.data();
    
    setPlayersInfos({
      player1Img: roomData?.player1Img,
      player2Img: roomData?.player2Img
    })

    if (roomData?.player1Img && roomData?.player2Img) {
      document.body.style.backgroundColor = 'rgb(44, 245, 44)';
      
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 400);
      setTimeout(() => {
        navigate(`/co-op/${createRoom}`);
        unsub()
      }, 2400);
    }  
});
}
  const saveRoom = async () => {

    try {
      await setDoc(doc(db, "Co-op", createRoom), {
        createdBy: userName,
        player1: userName,
        player1Img: userImg,
        player1Choice:[],
        player2: "",
        player2Img:"",
        player2Choice:[],
        gameChoice:[],
        currentPlayer: userName,
      });
      realTime()

    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = async () => {
    try {
      const coopRoom = doc(db, "Co-op", createRoom);
      const roomSnap = await getDoc(coopRoom);
    
      if (roomSnap.exists()) {
        const roomData = roomSnap.data();
        
        if (!roomData.player2) {  
          await updateDoc(coopRoom, {
            player2: userName,
            player2Img: userImg
          });
          realTime()

        }else{
          alert("sala cheia");
        }
      } else {
        alert("Sala não encontrada");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event:any) => {
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
            {playersInfos.player1Img && <img src={playersInfos.player1Img}/>}
            {playersInfos.player2Img && <img src={playersInfos.player2Img}/>}
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
