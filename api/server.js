const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('file-system'),
  shortId = require('shortid'),
  dbFilePath = 'tasks.json',
  adminPage = 'admin.json',
  app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/concerts', (req, res) => res.send(getTasksFromDB()));

app.post('/api/concerts', (req, res) => {
  const concertsData = getTasksFromDB();
  const concert = req.body;
  const tables = [];

  concert.id = shortId.generate();
  concert.status = 'In Progress';

  console.log(concert.tables);

  if (concert.tables) {
    for (let i = 1; i <= concert.tables; i++) {
      tables.push({
        type: 'table',
        number: i,
        price: concert.tablePrice,
        id: shortId.generate(),
        status: 'In Progress',
      });
    }
  }

  concert.danceFloor = concert.danceFloorCount
    ? {
        type: 'dance',
        count: concert.danceFloorCount,
        price: concert.danceFloorPrice,
        id: shortId.generate(),
        status: 'In Progress',
      }
    : {
        type: 'dance',
        count: null,
        price: null,
        id: null,
        status: 'Done',
      };

  concert.tables = tables;
  delete concert.tablePrice;
  delete concert.danceFloorCount,
    delete concert.danceFloorPrice,
    concertsData.push(concert);

  setTasksToDB(concertsData);

  res.send(concert);
});

app.get('/api/concert/:id', (req, res) => {
  const concertsData = getTasksFromDB(),
    concert = concertsData.find((concert) => concert.id === req.params.id);

  concert ? res.send(concert) : res.send({});
});

app.put('/api/concert/:id', (req, res) => {
  const concertsData = getTasksFromDB(),
    concert = concertsData.find((concert) => concert.id === req.params.id),
    updatedTask = req.body;

  concert.title = updatedTask.title;
  concert.description = updatedTask.description || 'No Description';

  setTasksToDB(concertsData);

  res.sendStatus(204);
});

app.put('/api/concert/:id/done', (req, res) => {
  const concertsData = getTasksFromDB(),
    concert = concertsData.find((concert) => concert.id === req.params.id);
  concert.status = 'Done';

  setTasksToDB(concertsData);

  res.sendStatus(204);
});

app.put('/api/concert/:id/confirm', (req, res) => {
  const concerts = getTasksFromDB(),
    concert = concerts.find((concert) => concert.id === req.body.concert.id);
  location =
    concert.danceFloor.id === req.params.id
      ? concert.danceFloor
      : concert.tables.find((table) => table.id === req.body.placeId);

  if (location.type === 'dance') {
    location.count = `${location.count - req.body.count}`;
    if (!+location.count) {
      location.status = 'Done';
    }
  } else {
    location.status = 'Done';
  }

  setTasksToDB(concerts);

  res.sendStatus(204);
});

app.delete('/api/concert/:id', (req, res) => {
  const tasksData = getTasksFromDB();
  tasks =
    req.params.id === 'all'
      ? []
      : tasksData.filter((task) => task.id !== req.params.id);

  setTasksToDB(tasks);

  res.sendStatus(204);
});

app.post('/api/sendMail', (req) => {
  const body = req.body;
  sendMail(body);
});

app.put('/api/admin', (req, res) => {
  const admin = getAdminFromDB();

  JSON.stringify(req.body) === JSON.stringify(admin)
    ? (admin.access = 'open')
    : admin;

  setAdminToDB(admin);

  res.sendStatus(204);
});

app.put('/api/admin/logout', (req, res) => {
  const admin = getAdminFromDB();

  delete admin.access
  
  setAdminToDB(admin);

  res.sendStatus(204);
});

app.get('/api/admin', (req, res) => res.send(getAdminFromDB()));

function getTasksFromDB() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

function getAdminFromDB() {
  return JSON.parse(fs.readFileSync(adminPage, 'utf8'));
}

function setAdminToDB(admin) {
  fs.writeFileSync(adminPage, JSON.stringify(admin));
}

function setTasksToDB(concerts) {
  fs.writeFileSync(dbFilePath, JSON.stringify(concerts));
}

function sendMail(body) {
  const dotenv = require('dotenv').config();
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const mailOptions = {
    from: 'dzmitry.babichev@gmail.com',
    to: 'dzmitry.babichev@gmail.com',
    subject: body.subject,
    text: `
    Имя: ${body.name ? body.name : '---'}
    Телефон: ${body.phone ? body.phone : '---'}
    Email: ${body.email ? body.email : '---'}
    ${body.concert ? `Концерт: ${body.concert.title}` : ``} 
    ${body.ticket ? `Номер Вашего билета: №${body.ticket}` : ``}
    ${body.count ? `Количество билетов: ${body.count}` : ``}
    `,
  };

  transporter.sendMail(mailOptions);
}

app.listen(3000, () => console.log('Server has been started...'));
