const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  fs = require('file-system'),
  shortId = require('shortid'),
  dbFilePath = 'tasks.json',
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

app.post('/api/task', (req, res) => {
  const tasksData = getTasksFromDB(),
    task = req.body;

  task.id = shortId.generate();
  task.description = task.description || 'No Description';
  task.status = 'In Progress';

  tasksData.push(task);
  setTasksToDB(tasksData);

  res.send(task);
});

app.get('/api/task/:id', (req, res) => {
  const tasksData = getTasksFromDB(),
    task = tasksData.find((task) => task.id === req.params.id);

  task ? res.send(task) : res.send({});
});

app.put('/api/task/:id', (req, res) => {
  const tasksData = getTasksFromDB(),
    task = tasksData.find((task) => task.id === req.params.id),
    updatedTask = req.body;

  task.title = updatedTask.title;
  task.description = updatedTask.description || 'No Description';

  setTasksToDB(tasksData);

  res.sendStatus(204);
});

app.put('/api/task/:id/done', (req, res) => {
  const tasksData = getTasksFromDB(),
    task = tasksData.find((task) => task.id === req.params.id);
  task.status = 'Done';

  setTasksToDB(tasksData);

  res.sendStatus(204);
});

app.put('/api/task/:id/confirm', (req, res) => {
  const concerts = getTasksFromDB(),
    concert = concerts.find((concert) => concert.id === req.body.concert.id);
  updatedConcert =
    concert.danceFloor.id === req.params.id
      ? concert.danceFloor
      : concert.tables.find((table) => table.id === req.body.placeId);

  if (updatedConcert.type === 'dance') {
    updatedConcert.count = `${updatedConcert.count - req.body.count}`;
    if (!+updatedConcert.count) {
      updatedConcert.status = 'Done';
    }
  } else {
    updatedConcert.status = 'Done';
  }

  setTasksToDB(concerts);

  res.sendStatus(204);
});

app.delete('/api/task/:id', (req, res) => {
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

function getTasksFromDB() {
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
}

function setTasksToDB(concerts) {
  fs.writeFileSync(dbFilePath, JSON.stringify(concerts));
}

function sendMail(body) {
  //Отправка письма на почту:
  const dotenv = require('dotenv').config();
  const nodemailer = require('nodemailer');

  //Залогиниваемся на почту:
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  //Конфигурируем объект с настройками самого сообщения:
  const mailOptions = {
    from: 'dzmitry.babichev@gmail.com',
    to: 'dzmitry.babichev@gmail.com',
    subject: body.subject,
    text: `Имя: ${body.name} Телефон: ${body.phone} Email: ${body.email}
    ${body.concert ? `Концерт: ${body.concert.title}` : ``}`,
  };

  //создаем функцию, которая будет отправлять письмо:
  transporter.sendMail(mailOptions);
}

app.listen(3000, () => console.log('Server has been started...'));
