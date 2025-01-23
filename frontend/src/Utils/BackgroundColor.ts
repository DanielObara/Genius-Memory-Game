import { PlayAudio } from "./PlayAudio";
import incorrectButton from "../Sounds/error-8-206492.mp3";
import correctButton from "../Sounds/new-notification-7-210334.mp3";
import '../Styles/BackgroundColor.css'

export function BackgroundColor(correctColor: boolean, timeStart: number, timeEnd: number) {
  const body = document.body;

  if (correctColor) {
    PlayAudio(correctButton);
    body.classList.add("background-correct");

    setTimeout(() => {
      body.classList.remove("background-correct");
    }, timeStart);
  } else {
    PlayAudio(incorrectButton);
    body.classList.add("background-incorrect");

    setTimeout(() => {
      body.classList.remove("background-incorrect");
    }, timeEnd);
  }
}
