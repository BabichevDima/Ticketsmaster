import Component from '../../views/component.js';

import Tasks from '../../models/tasks.js';

class About extends Component {
  constructor() {
    super();

    this.model = new Tasks();
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getTasksList().then((tasks) => resolve(tasks))
    );
  }

  render(tasks) {
    return new Promise((resolve) => {
      resolve(`
                <div class="about container"> 
                    <p class="about__info">Welcome ticketmaster app!</p>   
                    
                
                    <div class="about__email">
                        <p class="about__logo">	&#9993</p>
                        <div class="about__text">Получить консультацию</div>
                    </div>

                  <div class="form-box">
                      <h2>Для оформления заказа или консультации, пожалуйста,
                      оставьте свои контакты. Мы с вами свяжемся!</h2>
                    <form>
                      <div class="user-box">
                        <input type="text" class="name" required="" />
                        <label>Name</label>
                      </div>

                      <div class="user-box">
                        <input type="text" class="phone" required="" />
                        <label>Phone</label>
                      </div>

                      <div class="user-box">
                        <input type="email" class="email" required="" />
                        <label>Email</label>
                      </div>

                      <a class="button__sendMail" href="#">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Отправить
                      </a>
                    </form>
                  </div>

                </div>
            `);
    });
  }

  afterRender() {
    this.getFormHelps();
  }

  getFormHelps() {
    const phone = document.querySelector('.about__email');
    const phoneForm = document.querySelector('.form-box');
    const buttonMail = document.querySelector('.button__sendMail');
    const userName = document.querySelector('.name');
    const userEmail = document.querySelector('.email');
    const userPhone = document.querySelector('.phone');

    phone.addEventListener('mouseover', () => phone.classList.add('visible'));

    phone.addEventListener('click', (event) => {
      const target = event.target;
      if (target.className === 'about__text') {
        phoneForm.classList.add('visible');
      }
    });

    phoneForm.addEventListener('click', (event) => {
      event.preventDefault();
      const target = event.target;
      if (target.className === 'button__sendMail') {
        phoneForm.classList.remove('visible');
      }
    });

    phoneForm.addEventListener('mouseleave', () => {
      this.clearForm(userName, userEmail, userPhone);
      phoneForm.classList.remove('visible');
    });

    phone.addEventListener('mouseleave', () => {
      phone.classList.remove('visible');
    });

    buttonMail.addEventListener('click', () => {
      const mailOptions = {
        email: userEmail.value,
        subject: 'Нужна консультация',
        name: userName.value,
        phone: userPhone.value,
      };

      this.model.sendMail(mailOptions);
      phone.classList.remove('visible');
    });
  }

  clearForm(userName, userEmail, userPhone) {
    userPhone.value = '';
    userName.value = '';
    userEmail.value = '';
  }
}

export default About;
