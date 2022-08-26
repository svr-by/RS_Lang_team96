import { app } from '../../app';
import { NavLinks, Views } from '../enums';

class NavigationService {
  followLink(id: string) {
    switch (id) {
      case NavLinks.start:
        sessionStorage.setItem('view', Views.start);
        break;
      case NavLinks.textbook:
        sessionStorage.setItem('view', Views.textbook);
        break;
      case NavLinks.games:
        sessionStorage.setItem('view', Views.games);
        break;
      case NavLinks.statistics:
        sessionStorage.setItem('view', Views.statistics);
        break;
      case NavLinks.developers:
        sessionStorage.setItem('view', Views.developers);
        break;
      case NavLinks.video:
        sessionStorage.setItem('view', Views.video);
        break;
      default:
        break;
    }
    app.renderMain();
  }
}

export const navigationService = new NavigationService();
