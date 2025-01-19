import { doc } from "firebase/firestore";
import { db } from "../FireBase/firebase-config";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";


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