import { layoutService } from '../../shared/services/layoutService';
import { TeamMemberParams } from './types';

class TeamMember {
  name: string;
  pesp: string;
  title: string;
  githubLink: string;
  ava: string;

  constructor({ name, pesp, title, githubLink, ava }: TeamMemberParams) {
    this.name = name;
    this.title = title;
    this.pesp = pesp;
    this.githubLink = githubLink;
    this.ava = ava || 'dev_ava.jpg';
  }

  render() {
    const devsCard = layoutService.createElement({ tag: 'div', classes: ['devs__card'] });
    devsCard.innerHTML = `
    <a href="https://github.com/${this.githubLink}" class="devs__link">
      <div class="devs__img-wrap">
        <img src="assets/img/${this.ava}" alt="${this.title}" class="devs__img">
      </div>
      <h4 class="devs__name">${this.name}</h4>
      <p class="devs__title">${this.title}</p>
      <p class="devs__resp">${this.pesp}</p>
    </a>
    `;
    return devsCard;
  }
}

export default TeamMember;
