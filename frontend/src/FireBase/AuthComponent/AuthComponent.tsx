import { auth, provider } from '../firebase-config';
import { signInWithPopup } from "firebase/auth";
import { useState } from 'react';
import Cookies from "universal-cookie";
import LogOut from '/sair.png';
import GoogleImg from '/google.png';
import './Auth.css';

const cookies = new Cookies();

function AuthComponent() {
  const [isAuth, setIsAuth] = useState<boolean>(!!cookies.get("auth-token"));
  const [userImg, setUserImg] = useState<any>(cookies.get("userImg") || null);

  // ---------------------------
  // Funções Auxiliares
  // ---------------------------

  const saveAuthCookies = (result: { user: { refreshToken: string; displayName: any; photoURL: any } }): void => {
    cookies.set("auth-token", result.user.refreshToken);
    cookies.set("userName", result.user.displayName || "Usuário");
    cookies.set("userImg", result.user.photoURL || "");
  };

  const clearAuthCookies = (): void => {
    cookies.remove("auth-token");
    cookies.remove("userName");
    cookies.remove("userImg");
  };

  // ---------------------------
  // Funções principais
  // ---------------------------

  const handleSignIn = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      saveAuthCookies(result);

      setIsAuth(true);
      setUserImg(result.user.photoURL || null);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleSignOut = (): void => {
    clearAuthCookies();
    setIsAuth(false);
    setUserImg(null);
  };

  // ---------------------------
  // Renderização
  // ---------------------------

  return (
    <div className="Auth">
      {isAuth ? (
        <div className='Logado'>
          <button onClick={handleSignOut}>
            <img className='LogOut' src={LogOut} alt="Logout" />Sair da conta
          </button>
          {userImg && <img className='UserImg' src={userImg} alt="User Avatar" />}
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

export default AuthComponent;
