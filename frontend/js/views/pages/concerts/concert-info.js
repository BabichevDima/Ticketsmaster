import Component from '../../component.js';

import Error404 from '../error404.js';

import Concerts from '../../../models/concerts.js';

class ConcertInfo extends Component {
  constructor() {
    super();

    this.model = new Concerts();
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

      if (Object.keys(concert).length) {
        const { data, title, place, danceFloor, tables } = concert;

        html = `
					<div class='info container'>

					  <div class="info__header">
						  <div class="info__header_title">
							  ${title}
						  </div>

						  <div class="info__header_data">
							  <span>&#128197</span>
								${data}
						  </div>
					  </div>


					  <div class='info__block'>

						  <div class="info__scheme">

							  <div class='info__scheme_scene'>
								  <p>Сцена</p>
								  <div>
									  <span>&#9971</span>
									  ${place}
								  </div>
							  </div>

							  <div class="info__scheme_dance ${danceFloor.status === 'Done' ? `done` : ``}" data-id="${danceFloor.id}" >Танцпол</div>

							  <div class='info__scheme_tables'>
								  ${tables.map((table) => this.getTableHTML(table)).join('\n ')}
							  </div>

						  </div>

						  <div class="info__about">

							  <div class="info__about_title">Ваш заказ:</div>
							  <div class="info__about_details">Заказ пуст.</div>

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
    this.setActions();
  }

  setActions() {
    const infoDanceFloor = document.getElementsByClassName('info__scheme_dance')[0],
          infoDetailsTables = document.getElementsByClassName('info__scheme_tables')[0],
          infoDetails = document.getElementsByClassName('info__about_details')[0];

    infoDanceFloor.addEventListener('click', () => {
      infoDetails.innerHTML = this.showInfo(this.concert.danceFloor);
      this.removeActive(infoDetailsTables.children);
      infoDanceFloor.classList.add('pending');
    });

    infoDetailsTables.addEventListener('click', (event) => {
      const target = event.target;
      const id = target.dataset.id;
      const table = this.concert.tables.find((table) => id === table.id);

      if (target.classList.contains('info__scheme_table')) {
        this.removeActive(infoDetailsTables.children, infoDanceFloor);
        infoDetails.innerHTML = this.showInfo(table);
        target.classList.add('pending');
      }
    });

    infoDetails.addEventListener('click', (event) => {
      const button = document.getElementsByClassName('button')[0];

      if (event.target.classList.contains('button')) {
        this.redirectToConcertInfo(button.dataset.id);
      }
    });
  }

  showInfo({ type, count, number, price, id }) {
    return `
    <div class="info__about_place">${type === 'dance' ? 'Танцпол' : `Столик №${number}`}</div>

    ${type === 'dance' ? `<div class="info__about_place">Оставшееся количество мест: ${count}</div>` : ``}

    <div class="info__about_price">Стоимость ${price} $</div>

    <button class='button' data-id="${id}" data-type="${type}">Заказать</button>
  `;
  }

  getTableHTML(table) {
    return `
      <div class="info__scheme_table ${table.status === 'Done' ? `done` : ``}" data-id="${table.id}">Стол</div>
    `;
  }

  removeActive(tables, dance) {
    if (dance) {
      dance.classList.remove('pending');
    }
    for (let table of tables) {
      table.classList.remove('pending');
    }
  }

  redirectToConcertInfo(id) {
    location.hash = `#/concert/${this.concert.id}/${id}/confirm`;
  }
}

export default ConcertInfo;
