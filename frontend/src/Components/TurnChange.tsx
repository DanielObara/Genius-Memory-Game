import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FireBase/firebase-config";
import { useParams } from "react-router-dom";
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'
import Cookies from "universal-cookie";
import { TocarAudio } from './SoloGame';


const cookies = new Cookies();

async function TurnChange() {
    
    const { roomname }: any = useParams();
    const [userName] = useState(cookies.get("userName"));
    const roomRef = doc(db, "Co-op", roomname);
    

    if (userName === gameInfo.currentPlayer) {
        alert("É a sua vez");
        return;
    } else {
        alert("Não é a sua vez");
    }
    console.log(roomRef);

    
    return (
        <div>TurnChange</div>
    )
}

export default TurnChange