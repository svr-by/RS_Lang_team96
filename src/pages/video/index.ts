import { layoutService } from '../../shared/services/layoutService';

class VideoPage {
  elem: HTMLElement;
  videoLink: string;

  constructor() {
    this.elem = layoutService.createElement({ tag: 'section', classes: ['video__wrapper'] });
    this.videoLink = 'https://www.youtube.com/embed/mgty3Bgu';
  }

  render() {
    this.elem.innerHTML = `
      <div class="wrapper">
        <h2 class="page-title">Видеообзор</h2>
        <div class="video">
          <iframe src="${this.videoLink}-YY" class="video__player" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;
    return this.elem;
  }
}

export default VideoPage;
