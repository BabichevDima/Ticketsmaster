class Concerts {
  getConcertsList() {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/api/concerts');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  addConcert(concert) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/concerts');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send(JSON.stringify(concert));
    });
  }

  getConcert(id) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `http://localhost:3000/api/concert/${id}`);

      xhr.onload = () => resolve(JSON.parse(xhr.response));

      xhr.send();
    });
  }

  choosePlace(concertConfirm){
    return new Promise(resolve=>{
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/concert/${concertConfirm.placeId}/confirm`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(concertConfirm));
    })
  }

  sendMail(body) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', 'http://localhost:3000/api/sendMail');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(body));
    });
  }

  removeConcert(id) {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();

      xhr.open('DELETE', `http://localhost:3000/api/concert/${id}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send();
    });
  }

}

export default Concerts;
