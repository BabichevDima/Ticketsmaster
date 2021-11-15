import Component from '../../../views/component.js';

import Tasks from '../../../models/tasks.js';

class AddAndList extends Component {
  constructor() {
    super();

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
        <div class='container'>
			  	<h1 class="page-title">Список концертов</h1>
      
			  	<div class="concerts">
			  		<div class="concerts__list">
			  			${concerts.map((concert) => this.getTaskHTML(concert)).join('\n ')}
			  		</div>
			  	</div>
        </div>
			`);
    });
  }

  afterRender() {
    this.setActions();
  }

  setActions() {
    const concertsContainer = document.querySelector('.concerts__list');

    concertsContainer.addEventListener('click', (event) => {
      const target = event.target;
      const targetClassList = target.classList;

      switch (true) {
        case targetClassList.contains('concert__avatar'):
          this.redirectToTaskInfo(target.dataset.id);
          break;
      }
    });
  }

  getTaskHTML(concert) {
    return `
      <div class="concert">

        <img class="concert__avatar" src="${concert.image}" alt="photo" data-id='${concert.id}'/>

        <div class="concert__description">
          <div class="concert__info">
            <div>${concert.title}</div>
            <div class="concert__title">
            <span>&#128197</span>
            ${concert.data}</div>
          </div>
          
          <div class="concert__text">
          ${concert.description}
          </div>
        </div>

      </div>
    `;
  }

  redirectToTaskInfo(id) {
    location.hash = `#/concert/${id}`;
  }
}

export default AddAndList;
