import Games from 'src/app/games/games';

class App {
  async render() {
    new Games(document.body).render();
  }
}

export default App;
