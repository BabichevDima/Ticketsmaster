import Component from '../../../views/component.js';

import Concerts from '../../../models/concerts.js';
import ModelAdmin from '../../../models/model-admin.js';

class AdminPage extends Component {
  constructor() {
    super();

    this.model = new Concerts();
    this.modelAdmin = new ModelAdmin();
  }

  getData() {
    return new Promise((resolve) =>
      this.modelAdmin.getAdminPage().then(user => resolve(user))
    );
  }

  render(user) {
    return new Promise(resolve => {
      let html;

      if (this.isEditEnable(user)) {
        html = `
        <div class="admin container">
        <div class="admin__title">Добавить новый концерт</div>
  
        <form class="admin__form">
          <div class="admin__box">
            <label for="title">Title:</label>
            <input class="title" type="text" name="title" placeholder="Title" />
          </div>
          <div class="admin__box">
            <label for="data">Data:</label>
            <input class="data" type="text" name="data" placeholder="Data" />
          </div>
          <div class="admin__box">
            <label for="place">Place:</label>
            <input class="place" type="text" name="place" placeholder="Place" />
          </div>
          <div class="admin__box">
            <label for="description">Description:</label>
            <input
              class="description"
              type="text"
              name="description"
              placeholder="Description"
            />
          </div>
          <div class="admin__box">
            <label for="image">Link image:</label>
            <input
              class="image"
              type="text"
              name="image"
              placeholder="Link image"
            />
          </div>
          <div class="admin__box">
            <label for="danceFloorCount">Количество мест на танцполе:</label>
            <input
              class="danceFloorCount"
              type="text"
              name="danceFloorCount"
              placeholder="Количество мест на танцполе"
            />
          </div>
          <div class="admin__box">
            <label for="danceFloorPrice">Цена танцпола:</label>
            <input
              class="danceFloorPrice"
              type="text"
              name="danceFloorPrice"
              placeholder="Цена танцпола"
            />
          </div>
          <div class="admin__box">
            <label for="tables">Количество столиков:</label>
            <input
              class="tables"
              type="text"
              name="tables"
              placeholder="Количество столиков"
            />
          </div>
          <div class="admin__box">
            <label for="tablePrice">Цена столика:</label>
            <input
              class="tablePrice"
              type="text"
              name="tablePrice"
              placeholder="Цена столика"
            />
          </div>
        </form>
  
        <button class="admin__button_add button">Добавить концерт</button>
  
        <div class="admin__title">Удалить концерт</div>
        <form class="admin__form_remove">
          <div class="admin__box">
            <label for="id">Id:</label>
            <input
              class="concert_id"
              type="text"
              name="id"
              placeholder="Id концерта"
            />
          </div>
        </form>
        <button class="admin__button_remove button">Удалить концерт</button>
  
        <div class="admin__title">Не забудь нажать на кнопку ниже!</div>
        <button class="admin__button_logout button">log out</button>
  
      </div>
            `;
      } else {
        this.redirectToStartPage();
      }

      resolve(html);
    });
  }

  afterRender() {
    this.setActions();
  }

  isEditEnable(user) {
    return user.access === 'open';
  }

  redirectToStartPage() {
    location.hash = `#/`;
  }

  setActions() {
    const title = document.getElementsByClassName('title')[0],
      data = document.getElementsByClassName('data')[0],
      place = document.getElementsByClassName('place')[0],
      description = document.getElementsByClassName('description')[0],
      image = document.getElementsByClassName('image')[0],
      danceFloorCount = document.getElementsByClassName('danceFloorCount')[0],
      danceFloorPrice = document.getElementsByClassName('danceFloorPrice')[0],
      tables = document.getElementsByClassName('tables')[0],
      tablePrice = document.getElementsByClassName('tablePrice')[0],
      addedConcert = document.getElementsByClassName('admin__button_add')[0],
      logout = document.getElementsByClassName('admin__button_logout')[0],
      idConcert = document.getElementsByClassName('concert_id')[0],
      buttonRemove = document.getElementsByClassName('admin__button_remove')[0];

    addedConcert.addEventListener('click', () => {
      let concert = {
        title: title.value,
        data: data.value,
        place: place.value,
        description: description.value,
        image: image.value,
        danceFloorCount: danceFloorCount.value,
        danceFloorPrice: danceFloorPrice.value,
        tables: tables.value,
        tablePrice: tablePrice.value,
      };
      this.addConcert(concert);

      this.clearAddConcert(
        title,
        data,
        place,
        description,
        image,
        danceFloorCount,
        danceFloorPrice,
        tables,
        tablePrice
      );
    });

    buttonRemove.addEventListener('click', () => {
      if (confirm('Are you sure?')) {
        this.model.removeConcert(idConcert.value).then(() => {
          alert('Concert has been delete.')
        });
        this.clearAddConcert(idConcert);
      }
    });

    logout.addEventListener('click', () => {
      this.modelAdmin.changeAdmin().then(() => {
        this.redirectToStartPage();
      });
    });
  }

  addConcert(concert) {
    this.model.addConcert(concert).then(() => {
      alert('Concert has been added.')
    });
  }

  clearAddConcert(...arr) {
    arr.forEach(item => (item.value = ''));
  }

  redirectToStartPage() {
    location.hash = `#/`;
  }
}

export default AdminPage;
