import { useState } from "react";
import Cookies from "universal-cookie";

import "../Styles/CooperativeRoom.css";
import ButtonLink from "./ButtonLink";
import RoomForm from "./RoomForm";

const cookies = new Cookies();

const CooperativeRoom = () => {
  const [isAuth] = useState(cookies.get("auth-token"));
  const [userName] = useState(cookies.get("userName"));
  
  return (
    <div>
      <h1>Cooperativo</h1>
      {isAuth ? (
        <div>
          <p>Bem-vindo, {userName}</p>
          <RoomForm></RoomForm>
        </div>
      ) : (
        <p>Faça login primeiro</p>
      )}
      <ButtonLink buttontext={"Voltar"} to={"/"} id={"BackButton"} />
    </div>
  );
};

export default CooperativeRoom;
