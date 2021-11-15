import Component from '../../views/component.js';

class Header extends Component {
  render() {
    const resource = this.request.resource;

    const id = this.request.id;

    return new Promise((resolve) => {
      resolve(`
                <header class="container header">                    
                      <a href="#/">
                        <img src="../../../../images/logo2.png" alt="logo" class="header__logo" />
                      </a>

                      <a class="header__item ${resource === 'concerts' ? 'active' : ''}" href="#/concerts">
                        ${id ? 'К списку концертов' : 'Список концертов'}
                      </a>                                          
                </header>
            `);
    });
  }
}

export default Header;
