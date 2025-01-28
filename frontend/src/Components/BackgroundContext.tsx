import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import incorrectButton from "../Sounds/error-8-206492.mp3";
import correctButton from "../Sounds/new-notification-7-210334.mp3";
import { PlayAudio } from '../Utils/PlayAudio';

interface BackgroundContextProps {
  flashClass: string;
  setFlashClass: React.Dispatch<React.SetStateAction<string>>;
}

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

const BackgroundContext = createContext<BackgroundContextProps | undefined>(undefined);

const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [flashClass, setFlashClass] = useState<string>('');
  
  useEffect(() => {
    if (flashClass === 'flash-green') {
      PlayAudio(correctButton);
    } else if (flashClass === 'flash-red') {
      PlayAudio(incorrectButton);
    }
  }, [flashClass]); 

  return (
    <BackgroundContext.Provider value={{ flashClass, setFlashClass }}>
      <div className={`background-container ${flashClass}`}>
        {children}
      </div>
    </BackgroundContext.Provider>
  );
};

export default BackgroundProvider;

