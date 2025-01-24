import { PlayAudio } from "./PlayAudio";
import incorrectButton from "../Sounds/error-8-206492.mp3";
import correctButton from "../Sounds/new-notification-7-210334.mp3";
import '../Styles/BackgroundColor.css'

export function BackgroundColor(correctColor: boolean,audioEnable: boolean, timeStart: number, element: HTMLElement) {

  const audio = correctColor ? correctButton : incorrectButton;
  const cssClass = correctColor ? "background-correct" : "background-incorrect";

  if (audioEnable) {
    PlayAudio(audio);
  }
    element.classList.add(cssClass);

    setTimeout(() => {
      element.classList.remove(cssClass);
    }, timeStart);
  
}
