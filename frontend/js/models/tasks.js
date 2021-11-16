class Tasks {
  getTasksList() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/api/concerts');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  addTask(newTask) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/concert');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send(JSON.stringify(newTask));
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

  editTask(updatedTask) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/concert/${updatedTask.id}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(updatedTask));
    });
  }

  sendMail(body) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/sendMail');
      xhr.setRequestHeader('Content-Type', 'application/json');

      // xhr.onload = () => resolve(JSON.parse(xhr.response));
      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(body));
    });
  }

}

export default Tasks;
