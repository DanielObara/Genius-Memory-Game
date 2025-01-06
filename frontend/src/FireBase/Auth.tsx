import { auth, provider } from './firebase-config';
import { signInWithPopup } from "firebase/auth";
import { useState} from 'react';
import Cookies from "universal-cookie";
import LogOut from '/sair.png'
import GoogleImg from '/google.png'
import '../Styles/Auth.css'

const cookies = new Cookies();

function Auth() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [userName, setUserName] = useState(cookies.get("userName") );
  const [userImg, setUserImg] = useState(cookies.get("userImg"));

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      
      cookies.set("auth-token", result.user.refreshToken);
      cookies.set("userName", result.user.displayName);
      cookies.set("userImg", result.user.photoURL);

      setIsAuth(true);
      setUserName(result.user.displayName);
      setUserImg(result.user.photoURL);
    
    } catch (error) {
      console.log(error);
    }
  };

  function handleSignOut() {
      cookies.remove("auth-token");
      cookies.remove("userName");
      cookies.remove("userImg");
      setIsAuth(false);
      setUserName('');
      setUserImg('');
  }
  console.log(userImg);
  return (
    <div className="Auth">
      {isAuth ? (
        <div className='Logado'>
          <button onClick={handleSignOut}> 
            <img className='LogOut' src={LogOut}/>Sair da conta
          </button>
          <img className='UserImg' src={userImg} />
          
        </div>
      ) : (
        <div className='NaoLogado'>
          <button onClick={handleSignIn}>
            <img src={GoogleImg} alt="" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Auth;
