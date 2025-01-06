import { doc, setDoc, updateDoc, getDoc, onSnapshot} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { db } from "../FireBase/firebase-config";
import '../Styles/CooperativeRoom.css'

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
    console.log(doc.data());
    
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
    if (!isAuth) {
      console.log("usuário não autenticado");
      return;
    }

    try {
      await setDoc(doc(db, "Co-op", createRoom), {
        createdBy: userName,
        player1: userName,
        player1Img: userImg,
        player1Choice:[],
        player2: "",
        player2Img:"",
        player2Choice:[],
        gameChoice:[]
      });
      realTime()
      console.log("Sala criada");
      
    } catch (error) {
      console.error(error);
    }
  };

  const joinRoom = async () => {
    if (!isAuth) {
      console.log("usuário não autenticado");
      return;
    }

    try {
      const coopRoom = doc(db, "Co-op", createRoom);
      //pega a sala de co-op
      const roomSnap = await getDoc(coopRoom);
      //pega o que tem dentro da sala

      if (roomSnap.exists()) {
        //se a sala existe..
        const roomData = roomSnap.data();
        console.log(roomData);
        
        if (!roomData.player2) {
          //se não tem ninguem como player 2
          await updateDoc(coopRoom, {
            player2: userName,
            player2Img: userImg
          });
          realTime()
          console.log("Entrou na sala como Player 2");
        }else{
          console.log("sala cheia");
        }
      } else {
        console.log("Sala não encontrada");
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
    </div>
  );
}

export default CooperativeRoom;
