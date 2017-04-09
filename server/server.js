require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());

// send data from client to server
app.post('/todos', (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text: req.body.text,
  });

  todo.save()
    .then((doc) => {
      res.send(doc);
      console.log(`save todo: ${JSON.stringify(doc, null, 2)}`);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// Get all existing todos
app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => {
      // since our list is an array will going to wrap it in an object property
      res.send({
        todos,
      });

    }, error => {
      res.status(400).send(error);
    });
});

// Get individual Todo by ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send('Invalid Id!');
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not Found');
      };
      res.send({
        todo,
      });
    }, error => {
      res.status(400).send('Error to connect db');
    });
})

app.listen(PORT, (res) => {
  console.log(`started up to port: ${PORT}`);
});

// DELETE individual Todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send('Invalid Id!');
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not Found');
      };
      res
        .send({
          todo
        })
        .status(200);
    }).catch(error => {
      res.status(400).send('Error to connect db');
    });
});

// this allows us update our todos itmes
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send('Invalid Id!');
  }

  if (typeof req.body.completed === 'boolean' && req.body.completed) {
    req.body.completedAt = new Date().getTime();
  } else {
    req.body.completed = false;
    req.body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: req.body}, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send('Todo not Found');
      };
      res
        .send({
          todo
        })
    })
    .catch(e => res.status(400).send());
});

  module.exports = {
    app,
  };
