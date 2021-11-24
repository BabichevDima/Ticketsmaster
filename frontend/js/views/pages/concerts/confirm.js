import Component from '../../component.js';

import Error404 from '../error404.js';

import Concerts from '../../../models/concerts.js';

class Confirm extends Component {
  constructor() {
    super();

    this.model = new Concerts();
    this.placeId = this.request.placeId;
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getConcert(this.request.id).then((concert) => {
        this.concert = concert;

        resolve(concert);
      })
    );
  }

  render(concert) {
    return new Promise((resolve) => {
      let html;



      if (this.isEditEnable()) {
        const { id, title, data, place, description } = concert;
        const location =
          concert.danceFloor.id === this.placeId
            ? concert.danceFloor
            : concert.tables.find((table) => table.id === this.placeId);
        const { type, price, count, number } = location;

        html = `
          <div class= 'container confirm'>
					  <h1 class="page-title">Бронирование вашего места </h1>
					
					  <div class="confirm__edit">

              <div class="confirm__edit_header">
                <p><span>&#9971</span>${place}</p>
                <p><span>&#128197</span>${data}</p>
              </div>

						  <p class="confirm__edit_title">${title}</p>
						  <p class="confirm__edit_description">${description}</p>
              <p class="confirm__edit_type">Ваше место: ${type === 'dance' ? 'Танцпол' : `Столик №${number}`}</p>

              <div class="confirm__box">
                <label for="count">Count ticket: </label>
                <input class='confirm-edit__count' min = '1' type="number" id="count" name="count" ${
                  type === 'table' ? 'value="1" disabled' : 'value="1"'
                }/>
              </div>

              <div class="confirm__box">
                <label for="email">Email:</label>
                <input class='email' type="email" name="email" id="email" placeholder='Email' autocomplete="off"/>
              </div>

              <div class="confirm__box">
                <label for="name">Name:</label>
                <input class='name' type="name" name="name" id="name" placeholder='Name' autocomplete="off"/>
              </div>

              <div class="confirm__box">
                <label for="phone">Phone:</label>
                <input class='phone' type="text" name="phone" id="phone" placeholder='Phone' autocomplete="off"/>
              </div>

              <p class="confirm__edit_price">Цена $<span class="price" data-count='${count}' data-price='${price}'> ${price}</span></p>
              
						  <div class="confirm__edit_buttons">
							  <button class="confirm__edit_save button">Забронировать</button>
							  <a class="confirm__edit_back button" href="#/concert/${id}">Назад к выбору места</a>
						  </div>
					  </div>
          </div>
				`;
      } else {
        html = new Error404().render();
      }

      resolve(html);
    });
  }

  afterRender() {
    this.isEditEnable() && this.setActions();
  }

  isEditEnable() {
    let location =
    this.concert.danceFloor.id === this.placeId
      ? this.concert.danceFloor
      : this.concert.tables.find((table) => table.id === this.placeId);

    return Object.keys(location).length && (location).status !== 'Done';
  }

  setActions() {
    const buttonBy = document.getElementsByClassName('confirm__edit_save')[0],
      countTicket = document.getElementsByClassName('confirm-edit__count')[0],
      priceTicket = document.getElementsByClassName('price')[0],
      userName = document.querySelector('.name'),
      userEmail = document.querySelector('.email'),
      userPhone = document.querySelector('.phone');

    countTicket.addEventListener('keyup', (event) => {
      if (+event.target.value.trim() > priceTicket.dataset.count) {
        alert(`Осталось всего ${priceTicket.dataset.count} мест на танцполе`);
        event.target.value = '1';
      }
      if (!+event.target.value.trim() || +event.target.value.trim() < 0) {
        buttonBy.disabled = true;
        buttonBy.classList.add('done');
      } else {
        buttonBy.disabled = false;
        buttonBy.classList.remove('done');
      }
      priceTicket.innerHTML = +event.target.value * priceTicket.dataset.price;
    });

    buttonBy.addEventListener('click', () => {
      this.byTicket(+countTicket.value, userName, userEmail, userPhone);
    });
  }

  byTicket(count, userName, userEmail, userPhone) {
    const concertConfirm = {
      concert: this.concert,
      placeId: this.placeId,
      count,
    };
    const mailOptions = {
      email: userEmail.value.trim(),
      subject: 'Заказ оформлен',
      name: userName.value.trim(),
      phone: userPhone.value.trim(),
      concert: this.concert,
      ticket: concertConfirm.placeId,
      count: concertConfirm.count,
    };

    this.model.choosePlace(concertConfirm).then(() => {
      this.redirectToConcertInfo();
    });

    this.model.sendMail(mailOptions);
  }

  redirectToConcertInfo() {
    location.hash = `#/concert/${this.concert.id}`;
  }
}

export default Confirm;
