import IWord from '../../../interfaces/word';

export default function playSound(randomWord: IWord): void {
  const sound = new Audio();
  sound.src = `http://localhost:8000/${randomWord.audio}`;
  sound.autoplay = true;
}
