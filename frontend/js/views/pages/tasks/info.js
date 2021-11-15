import Component from '../../../views/component.js';

import Error404 from '../../../views/pages/error404.js';

import Tasks from '../../../models/tasks.js';

class Info extends Component {
  constructor() {
    super();

    this.model = new Tasks();
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getTask(this.request.id).then((task) => {
        this.task = task;

        resolve(task);
      })
    );
  }

  render(tasks) {
    return new Promise((resolve) => {
      let html;

      if (Object.keys(tasks).length) {
        const { data, title, place, danceFloor, tables } = tasks;

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
								<div>Сцена</div>
								<div>
									<span>&#9971</span>
									${place}
								</div>
							</div>

							<div class="info__scheme_dance ${
                danceFloor.status === 'Done' ? `done` : ``
              }" data-id="${danceFloor.id}" >Танцпол</div>

							<div class='info__scheme_tables'>
								${tables.map((table) => this.getTableHTML(table)).join('\n ')}
							</div>
						</div>

						<div class="info__about">

							<div class="info__about_title">	Ваш заказ: </div>
							
							<div class="info__about_details"> Заказ пуст. </div>


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
    const infoDanceFloor =
      document.getElementsByClassName('info__scheme_dance')[0];
    const infoDetailsTables = document.getElementsByClassName(
      'info__scheme_tables'
    )[0];
    const infoDetails = document.getElementsByClassName(
      'info__about_details'
    )[0];

    infoDanceFloor.addEventListener('click', (event) => {
      infoDetails.innerHTML = this.showInfo(this.task.danceFloor);
      this.removeActive(infoDetailsTables.children);
      infoDanceFloor.classList.add('inProgress');
    });

    infoDetailsTables.addEventListener('click', (event) => {
      const target = event.target;
      const id = target.dataset.id;
      const table = this.task.tables.find((table) => id === table.id);

      if (target.classList.contains('info__scheme_table')) {
        this.removeActive(infoDetailsTables.children, infoDanceFloor);
        infoDetails.innerHTML = this.showInfo(table);
        target.classList.add('inProgress');
      }
    });

    infoDetails.addEventListener('click', (event) => {
      const button = document.getElementsByClassName('button')[0];

      if (event.target.classList.contains('button')) {
        this.redirectToTaskInfo(button.dataset.id);
      }
    });
  }

  showInfo({ type, count, number, price, id }) {
    return `

    <div class="info__about_place">
      ${type === 'dance' ? 'Танцпол' : `Столик №${number}`}
    </div>

    ${
      type === 'dance'
        ? `<div class="info__about_place">Оставшееся количество мест: ${count}</div>`
        : ``
    }

    <div class="info__about_price">
      Стоимость ${price} $
    </div>

    <button class='button' data-id="${id}" data-type="${type}">Заказать</button>
    
  `;
  }

  getTableHTML(table) {
    return `
      <div class="info__scheme_table ${
        table.status === 'Done' ? `done` : ``
      }" data-id="${table.id}">Стол
      </div>
    `;
  }

  removeActive(tables, dance) {
    if (dance) {
      dance.classList.remove('inProgress');
    }
    for (let table of tables) {
      table.classList.remove('inProgress');
    }
  }

  redirectToTaskInfo(id) {
    location.hash = `#/concert/${this.task.id}/${id}/confirm`;
  }
}

export default Info;
