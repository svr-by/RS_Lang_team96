import { layoutService } from '../../shared/services/layoutService';
import TeamMember from './TeamMember';

class DevsPage {
  elem: HTMLElement;
  mentor: TeamMember;
  team: TeamMember[];

  constructor() {
    this.elem = layoutService.createElement({ tag: 'div', classes: ['devs__wrapper'] });
    this.mentor = new TeamMember({
      name: 'Катерина',
      pesp: 'Всесторонняя поддержка проекта',
      title: 'mentor',
      githubLink: 'CatherineShemenkova',
      ava: 'mentor_ava.jpg',
    });
    this.team = [
      new TeamMember({
        name: 'Сергей Рачковский',
        pesp: 'Интеграция с бэкендом, авторизация и регистрация, стартовая страница',
        title: 'developer, teamlead',
        githubLink: 'svr-by',
      }),
      new TeamMember({
        name: 'Денис Логимахов',
        pesp: 'Электронный учебник, разделы "Сложные слова" и "Изученные слова"',
        title: 'developer',
        githubLink: 'denis169',
      }),
      new TeamMember({
        name: 'Игорь Левачков',
        pesp: 'Мини-игры "Аудиовызов" и "Спринт", сбор и отображение статистики',
        title: 'developer',
        githubLink: 'brombom',
      }),
    ];
  }

  render() {
    this.elem.innerHTML = '';
    const wrapper = layoutService.createElement({ tag: 'div', classes: ['wrapper'] });
    const pageTitle = layoutService.createElement({ tag: 'h2', text: 'Наша команда', classes: ['page-title'] });
    wrapper.append(pageTitle);
    const devs = layoutService.createElement({ tag: 'div', classes: ['devs'] });
    const firstDevsRow = layoutService.createElement({ tag: 'div', classes: ['devs__row'] });
    firstDevsRow.append(this.mentor.render());
    devs.append(firstDevsRow);
    const secondDevsRow = layoutService.createElement({ tag: 'div', classes: ['devs__row'] });
    this.team.forEach((teamMember) => secondDevsRow.append(teamMember.render()));
    devs.append(secondDevsRow);
    wrapper.append(devs);
    this.elem.append(wrapper);
    return this.elem;
  }
}

export default DevsPage;
