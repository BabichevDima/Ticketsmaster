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

      xhr.open('POST', 'http://localhost:3000/api/task');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send(JSON.stringify(newTask));
    });
  }

  getTask(id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `http://localhost:3000/api/task/${id}`);

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  removeTask(id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('DELETE', `http://localhost:3000/api/task/${id}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send();
    });
  }

  editStatusTask(id) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/task/${id}/done`);

      xhr.onload = () => resolve();

      xhr.send();
    });
  }

  choosePlace(concertConfirm){
    return new Promise((resolve)=>{
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/task/${concertConfirm.placeId}/confirm`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(concertConfirm));
    })
  }

  editTask(updatedTask) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/task/${updatedTask.id}`);
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

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send(JSON.stringify(body));
    });
  }

}

export default Tasks;
