const express = require('express');
const { v4: generateId } = require('uuid');
const database = require('./database');

const app = express();

function requestLogger(req, res, next) {
  res.once('finish', () => {
    const log = [req.method, req.path];

    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }

    if (req.query && Object.keys(req.query).length > 0) {
      log.push(JSON.stringify(req.query));
    }

    log.push('->', res.statusCode);
    // eslint-disable-next-line no-console
    console.log(log.join(' '));
  });

  next();
}

app.use(requestLogger);
app.use(require('cors')());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/todos', async (req, res) => {
  const page_number = Number(req.query.page_number) || 0;
  const todos_per_page = 20;
  const skip = Number(todos_per_page * page_number);

  const todos = database.client.db('todos').collection('todos');
  const response = await todos
    .find({})
    .skip(skip)
    .limit(todos_per_page)
    .toArray();

  res.status(200).json(response);
});

app.post('/todos', async (req, res) => {
  const { text, due_date } = req.body;

  if (typeof text !== 'string') {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }

  const todo = { id: generateId(), text, due_date, completed: false };
  await database.client.db('todos').collection('todos').insertOne(todo);
  res.status(201).json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await database.client
    .db('todos')
    .collection('todo')
    .updateOne({ id }, { $set: { completed } });
  res.status(200);
  res.end();
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await database.client.db('todos').collection('todos').deleteOne({ id });
  res.status(203);
  res.end();
});

module.exports = app;
