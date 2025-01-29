import { useState } from "react";
import Cookies from "universal-cookie";
import ButtonLink from "../ButtonLink/ButtonLink";
import RoomForm from "../RoomForm/RoomForm";

const cookies = new Cookies();

const CooperativeRoom = () => {
  const [isAuth] = useState<string | null>(cookies.get("auth-token") || null);
  const [userName] = useState<string | null>(cookies.get("userName") || "Convidado");

  return (
    <div>
      <h1>Cooperativo</h1>
      {isAuth ? (
        <div>
          <p>Bem-vindo, {userName}</p>
          <RoomForm />
        </div>
      ) : (
        <p>Faça login primeiro</p>
      )}
      <ButtonLink buttontext={"Voltar"} to={"/"} id={"BackButton"} />
    </div>
  );
};

export default CooperativeRoom;
