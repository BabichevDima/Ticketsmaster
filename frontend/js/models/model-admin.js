class Admin {
  checkAdmin(user) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/admin`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send(JSON.stringify(user));
    });
  }

  changeAdmin() {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open('PUT', `http://localhost:3000/api/admin/logout`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => resolve();

      xhr.send();
    });
  }

  getAdminPage() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', 'http://localhost:3000/api/admin7');

      xhr.onload = () => {
        try {
          resolve(JSON.parse(xhr.response));
        } catch {
          alert(Error)
        }
      };

      xhr.send();
    });
  }
}

export default Admin;
