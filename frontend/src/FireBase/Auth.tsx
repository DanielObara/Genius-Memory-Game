import { auth, provider } from './firebase-config';
import { signInWithPopup } from "firebase/auth";
import { useState } from 'react';
import Cookies from "universal-cookie";
import LogOut from '/sair.png';
import GoogleImg from '/google.png';
import '../Styles/Auth.css';

const cookies = new Cookies();

function Auth() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [userImg, setUserImg] = useState(cookies.get("userImg"));

  // ---------------------------
  // Funções Auxiliares
  // ---------------------------

  const saveAuthCookies = (result: any) => {
    cookies.set("auth-token", result.user.refreshToken);
    cookies.set("userName", result.user.displayName);
    cookies.set("userImg", result.user.photoURL);
  };

  const clearAuthCookies = () => {
    cookies.remove("auth-token");
    cookies.remove("userName");
    cookies.remove("userImg");
  };

  // ---------------------------
  // Funções principais
  // ---------------------------

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      saveAuthCookies(result);

      setIsAuth(true);
      setUserImg(result.user.photoURL);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      
    }
  };

  const handleSignOut = () => {
    clearAuthCookies();
    setIsAuth(false);
    setUserImg('');
  };

  // ---------------------------
  // Renderização
  // ---------------------------

  return (
    <div className="Auth">
      {isAuth ? (
        <div className='Logado'>
          <button onClick={handleSignOut}>
            <img className='LogOut' src={LogOut} alt="Sair" />Sair da conta
          </button>
          <img className='UserImg' src={userImg} alt="Usuário" />
        </div>
      ) : (
        <div className='NaoLogado'>
          <button onClick={handleSignIn}>
            <img src={GoogleImg} alt="Entrar com Google" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Auth;
