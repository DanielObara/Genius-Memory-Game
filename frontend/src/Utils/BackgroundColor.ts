import { PlayAudio } from "./PlayAudio";
import incorrectButton from "../Sounds/error-8-206492.mp3";
import correctButton from "../Sounds/new-notification-7-210334.mp3";
import '../Styles/BackgroundColor.css'

export function BackgroundColor(correctColor: boolean, timeStart: number) {
  const body = document.body;

  const audio = correctColor ? correctButton : incorrectButton;
  const cssClass = correctColor ? "background-correct" : "background-incorrect";

    PlayAudio(audio);
    body.classList.add(cssClass);

    setTimeout(() => {
      body.classList.remove(cssClass);
    }, timeStart);
  
}
