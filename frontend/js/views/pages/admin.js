import Component from '../../views/component.js';

import Tasks from '../../models/tasks.js';

class Admin extends Component {
  constructor() {
    super();

    this.model = new Tasks();
  }

  getData() {
    return new Promise((resolve) => resolve());
  }

  render() {
    return new Promise((resolve) => {
      resolve(`
                <div class="admin container"> 

                <form class="admin__form">

                  <div class="admin__box">
                    <label for="login">Login:</label>
                    <input class='login' type="text" name="login" placeholder='Login'/>
                  </div>

                  <div class="admin__box">
                    <label for="password">Password:</label>
                    <input class='password' type="password" name="password" placeholder='Password'/>
                  </div>

                </form>

                <button class='admin__button button'> Log in </button>

                <div class="error"></div>

                </div>
            `);
    });
  }

  afterRender() {
    this.setActions();
  }

  setActions() {
    const form = document.getElementsByClassName('admin__form')[0];
    const login = document.getElementsByClassName('login')[0];
    const password = document.getElementsByClassName('password')[0];
    const button = document.getElementsByClassName('admin__button')[0];
    const errorMessage = document.getElementsByClassName('error')[0];

    button.addEventListener('click', () => {
      // event.preventDefault();
      let user = {
        login: login.value,
        password: password.value,
      };

      this.model.checkAdmin(user).then(() => {

        // console.log(obj)
        this.redirectToAddedConcert();
      });
      // .catch(alert('Неверно ввелли логин или пароль.'));
    });
  }

  redirectToAddedConcert() {
    location.hash = `#/addedPage`;
  }
}

export default Admin;
