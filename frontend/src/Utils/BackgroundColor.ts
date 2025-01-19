import { PlayAudio } from "./PlayAudio";
import incorrectButton from '../Sounds/error-8-206492.mp3'
import correctButton from '../Sounds/new-notification-7-210334.mp3'

export function BackgroundColor(correctColor:boolean,/* BackgroundColor:string */) {
    if (correctColor) {
        PlayAudio(correctButton)
  
        document.body.style.backgroundColor = 'rgb(44, 245, 44)';
        setTimeout(() => {
          document.body.style.backgroundColor = '';
        }, 220);
      
      } else {
        PlayAudio(incorrectButton)
        document.body.style.backgroundColor = 'red';
        setTimeout(() => {
          document.body.style.backgroundColor = '';
        }, 220);
    }
}