import Component from '../../views/component.js';

class Footer extends Component {
  render() {
    return new Promise((resolve) => {
      resolve(`
              <footer class="footer">                   
                  <p class="footer__info"> &copy Babichev Dmitry, 2021 </p>                  
              </footer>
            `);
    });
  }
}

export default Footer;
