export function PlayAudio(audioFile: string) {
    const audio = new Audio(audioFile);
    audio.play();
}