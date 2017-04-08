const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, (res) => {
  console.log(`successed connected to localhost: ${PORT}`);
});

module.exports = {
  app,
};
