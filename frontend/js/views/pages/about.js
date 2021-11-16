import Component from '../../views/component.js';

import Tasks from '../../models/tasks.js';

class About extends Component {
  constructor() {
    super();

    this.index = 0;
    this.model = new Tasks();
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getTasksList().then((concerts) => resolve(concerts))
    );
  }

  render(concerts) {
    return new Promise((resolve) => {
      resolve(`
                <div class="about container"> 
                    <p class="about__info">Welcome ticketmaster app!</p>   
                    
                    <div class='about__slider'>
                      ${concerts
                        .map((concert, index) =>
                          this.getConcertHTML(concert, index)
                        )
                        .join('\n ')}
                    </div>

                    <div class="about__buttons">
                      <div class="about__buttons_prev">
                        &#10094
                      </div>
                      <div class="about__buttons_next">
                        &#10095
                      </div>
                    </div>
                
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

    const slides = document.querySelectorAll('.slide');
    const prev = document.querySelector('.about__buttons_prev');
    const next = document.querySelector('.about__buttons_next');

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

    userPhone.addEventListener('blur', () => {
      this.validForm(userPhone, buttonMail);
    });

    userEmail.addEventListener('blur', () => {
      this.validForm(userEmail, buttonMail);
    });

    userName.addEventListener('blur', () => {
      this.validForm(userName, buttonMail);
    });

    next.addEventListener('click', () => {
      this.nextSlide(slides);
    });
    prev.addEventListener('click', () => {
      this.prevSlide(slides);
    });
  }

  validForm(block, buttonMail) {
    switch (block.className) {
      case 'phone':
        const regExpPhone =
          /^(\+?375-?|8-?0)(44|29|33|17|25)-?[1-9](\d){2}(-?(\d){2}){2}$/;
        if (regExpPhone.test(+block.value.trim())) {
          buttonMail.disabled = false;
          buttonMail.classList.remove('done');
        } else {
          buttonMail.disabled = true;
          buttonMail.classList.add('done');
          block.value = '';
        }
        break;

      case 'email':
        const regExpEmail = /@[a-z\d]{1,10}\.com$/;
        if (regExpEmail.test(block.value.trim())) {
          buttonMail.disabled = false;
          buttonMail.classList.remove('done');
        } else {
          buttonMail.disabled = true;
          buttonMail.classList.add('done');
          block.value = '';
        }
        break;

      case 'name':
        if (block.value.trim()) {
          buttonMail.disabled = false;
          buttonMail.classList.remove('done');
        } else {
          buttonMail.disabled = true;
          buttonMail.classList.add('done');
          block.value = '';
        }
        break;
    }
  }

  clearForm(userName, userEmail, userPhone) {
    userPhone.value = '';
    userName.value = '';
    userEmail.value = '';
  }

  getConcertHTML(concert, index) {
    return `
          <div class="slide ${!index ? 'slide__active' : ''}">
              <div class="slide__title">${concert.title}</div>
              <img class="slide__avatar" src="${concert.image}" alt="photo"/>
              <a class="button slide__button" href="#/concert/${concert.id}">К концерту</a>
          </div>
    `;
  }

  nextSlide(slides) {
    if (this.index == slides.length - 1) {
      this.index = 0;
      this.activeSlide(slides);
    } else {
      this.index++;
      this.activeSlide(slides);
    }
  }

  prevSlide(slides) {
    if (this.index == 0) {
      this.index = slides.length - 1;
      this.activeSlide(slides);
    } else {
      this.index--;
      this.activeSlide(slides);
    }
  }

  activeSlide(slides) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove('slide__active');
    }
    slides[this.index].classList.add('slide__active');
  }
}

export default About;
