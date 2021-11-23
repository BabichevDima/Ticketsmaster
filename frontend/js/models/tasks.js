class Tasks {
  getTasksList() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/api/concerts');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  addConcert(concert) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/concerts');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send(JSON.stringify(concert));
    });
  }

  getTask(id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `http://localhost:3000/api/concert/${id}`);

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  choosePlace(concertConfirm){
    return new Promise((resolve)=>{
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/concert/${concertConfirm.placeId}/confirm`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(concertConfirm));
    })
  }

  sendMail(body) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/sendMail');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(body));
    });
  }

  checkAdmin(user){
    return new Promise((resolve)=>{
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/admin`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(user));
    })
  }

  changeAdmin(){
    return new Promise((resolve)=>{
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/admin/logout`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send();
    })
  }

  getAdminPage() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/api/admin');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  removeConcert(id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('DELETE', `http://localhost:3000/api/concert/${id}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send();
    });
  }

}

export default Tasks;
