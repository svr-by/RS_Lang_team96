import { IWord } from '../../../shared/interfaces';
import { api } from '../../../api/api';

export default function playSound(randomWord: IWord): void {
  const sound = new Audio();
  sound.src = `${api.base}/${randomWord.audio}`;
  sound.autoplay = true;
}
