import Component from '../../../views/component.js';

import Concerts from '../../../models/concerts.js';
import ModelAdmin from '../../../models/model-admin.js';

class Admin extends Component {
  constructor() {
    super();

    this.model = new Concerts();
    this.modelAdmin = new ModelAdmin();
  }

  getData() {
    return new Promise(resolve => resolve());
  }

  render() {
    return new Promise(resolve => {
      resolve(`
              <div class="admin container">
                <form class="admin__form">
                  <div class="admin__box">
                    <label for="login">Login:</label>
                    <input class="login" type="text" name="login" placeholder="Login" autocomplete="off"/>
                  </div>

                  <div class="admin__box">
                    <label for="password">Password:</label>
                    <input class="password" type="password" name="password" placeholder="Password" autocomplete="off" />
                  </div>
                </form>

                <button class="admin__button button">Log in</button>
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

    button.addEventListener('click', () => {
      let user = {
        login: login.value,
        password: password.value
      };

      this.modelAdmin.checkAdmin(user).then(() => {
        this.redirectToAddedConcert();
      });
    });
  }

  redirectToAddedConcert() {
    location.hash = `#/addedPage`;
  }
}

export default Admin;
