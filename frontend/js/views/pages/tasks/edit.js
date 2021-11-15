import Component from '../../../views/component.js';

import Error404 from '../../../views/pages/error404.js';

import Tasks from '../../../models/tasks.js';

class Edit extends Component {
  constructor() {
    super();

    this.model = new Tasks();
    this.placeId = this.request.placeId;
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getTask(this.request.id).then((task) => {
        this.task = task;

        resolve(task);
      })
    );
  }

  render(task) {
    return new Promise((resolve) => {
      let html;

      if (this.isEditEnable()) {
        const { id, title, data, place, description } = task;
        const concert =
          task.danceFloor.id === this.placeId
            ? task.danceFloor
            : task.tables.find((table) => table.id === this.placeId);
        const { type, price, count, number } = concert;

        html = `
          <div class= 'container confirm'>
					  <h1 class="page-title">Бронирование вашего места </h1>
					
					  <div class="confirm__edit">

						  <p>${title}</p>

						  <p><span>&#128197</span>${data}</p>

						  <p><span>&#9971</span>${place}</p>

						  <p>${description}</p>

              <p>Ваше место: ${
                type === 'dance' ? 'Танцпол' : `Столик №${number}`
              }</p>

              <div class="confirm__box">
                <label for="count">Count ticket: </label>
                <input class='confirm-edit__count' type="number" id="count" name="count" ${
                  type === 'table' ? 'value="1" disabled' : 'value="1"'
                }/>
              </div>

              <div class="confirm__box">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" placeholder='Email'/>
              </div>

              <div class="confirm__box">
                <label for="name">Name</label>
                <input type="name" name="name" id="name" placeholder='Name'/>
              </div>

              <p>Цена $
                <span class='confirm-edit__price' data-count='${count}' data-price='${price}'>${price}</span>
              </p>
              

				
						  <div class="confirm-edit__buttons">
							  <button class="confirm-edit__btn-save button">Забронировать</button>
							  <a class="confirm-edit__btn-back button" href="#/concert/${id}">К выбору места</a>
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
    return Object.keys(this.task).length && this.task.status !== 'Done';
  }

  setActions() {
    const buttonBy = document.getElementsByClassName(
      'confirm-edit__btn-save'
    )[0];
    const numberTicket = document.getElementsByClassName(
      'confirm-edit__count'
    )[0];
    const priceTicket = document.getElementsByClassName(
      'confirm-edit__price'
    )[0];

    numberTicket.addEventListener('keyup', (event) => {
      if (+event.target.value.trim() > priceTicket.dataset.count) {
        alert(`Осталось всего ${priceTicket.dataset.count} мест на танцполе`);
        event.target.value = '1';
      }
      if (!+event.target.value.trim()) {
        buttonBy.disabled = true;
        buttonBy.classList.add('done');
      } else {
        buttonBy.disabled = false;
        buttonBy.classList.remove('done');
      }
      priceTicket.innerHTML = +event.target.value * priceTicket.dataset.price;
    });

    buttonBy.addEventListener('click', () => {
      this.byTicket(+numberTicket.value);
    });
  }

  byTicket(count) {
    const concertConfirm = {
      concert: this.task,
      placeId: this.placeId,
      count,
    };
    const mailOptions = {
      email: 'Заказ',
      subject: 'Заказ оформлен',
      name: 'Заказ',
      phone: 'Заказ',
      concert: this.task,
    };

    this.model.choosePlace(concertConfirm).then(() => {
      this.redirectToTaskInfo();
    });

    this.model.sendMail(mailOptions);
  }

  editTask(editTaskTitle, editTaskDescription) {
    this.task.title = editTaskTitle.value.trim();
    this.task.description = editTaskDescription.value.trim();

    this.model.editTask(this.task).then(() => this.redirectToTaskInfo());
  }

  redirectToTaskInfo() {
    location.hash = `#/concert/${this.task.id}`;
  }
}

export default Edit;
