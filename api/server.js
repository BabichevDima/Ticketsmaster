const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('file-system'),
  shortId = require('shortid'),
  dbFilePath = 'concerts.json',
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

app.get('/api/concerts', (req, res) => res.send(getConcertsFromDB()));

app.post('/api/concerts', (req, res) => {
  const concertsData = getConcertsFromDB();
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
        status: 'In Progress'
      });
    }
  }

  concert.danceFloor = concert.danceFloorCount
    ? {
        type: 'dance',
        count: concert.danceFloorCount,
        price: concert.danceFloorPrice,
        id: shortId.generate(),
        status: 'In Progress'
      }
    : {
        type: 'dance',
        count: null,
        price: null,
        id: null,
        status: 'Done'
      };

  concert.tables = tables;
  delete concert.tablePrice;
  delete concert.danceFloorCount,
    delete concert.danceFloorPrice,
    concertsData.push(concert);

  setConcertsToDB(concertsData);

  res.send(concert);
});

app.get('/api/concert/:id', (req, res) => {
  const concertsData = getConcertsFromDB(),
    concert = concertsData.find((concert) => concert.id === req.params.id);

  concert ? res.send(concert) : res.send({});
});

app.put('/api/concert/:id/done', (req, res) => {
  const concertsData = getConcertsFromDB(),
    concert = concertsData.find(concert => concert.id === req.params.id);
  concert.status = 'Done';

  setConcertsToDB(concertsData);

  res.sendStatus(204);
});

app.put('/api/concert/:id/confirm', (req, res) => {
  const concerts = getConcertsFromDB(),
    concert = concerts.find(concert => concert.id === req.body.concert.id);
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

  setConcertsToDB(concerts);

  res.sendStatus(204);
});

app.delete('/api/concert/:id', (req, res) => {
  const concerts = getConcertsFromDB();
  updatedConcerts = concerts.filter(concert => concert.id !== req.params.id);

  setConcertsToDB(updatedConcerts);

  res.sendStatus(204);
});

app.post('/api/sendMail', req => {
  const body = req.body;
  sendMail(body);
});

app.put('/api/admin', (req, res) => {
  const admin = getAdminFromDB();

  if (admin.login === req.body.login && admin.password === req.body.password) {
    admin.access = 'open';
  }

  setAdminToDB(admin);

  res.sendStatus(204);
});

app.put('/api/admin/logout', (req, res) => {
  const admin = getAdminFromDB();

  admin.access = 'close';

  setAdminToDB(admin);

  res.sendStatus(204);
});

app.get('/api/admin', (req, res) => res.send(getAdminFromDB()));

function getConcertsFromDB() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

function getAdminFromDB() {
  return JSON.parse(fs.readFileSync(adminPage, 'utf8'));
}

function setAdminToDB(admin) {
  fs.writeFileSync(adminPage, JSON.stringify(admin));
}

function setConcertsToDB(concerts) {
  fs.writeFileSync(dbFilePath, JSON.stringify(concerts));
}

const sendMail = (body) => {
  const dotenv = require('dotenv').config();
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
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
    `
  };

  transporter.sendMail(mailOptions);
};

app.listen(3000, () => console.log('Server has been started...'));
