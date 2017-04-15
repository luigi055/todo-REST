require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const authenticate = require('./middleware/authenticate');

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

  Todo.findByIdAndUpdate(id, { $set: req.body }, { new: true })
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

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  // body is the equivalent to  { email: email, password: password }
  // another alternative without using lodash is 
  // { email: req.body.email, password: req.body.password }
  const user = new User(body);
  user.save()
    .then(() => {
      return user.generateAuthToken(); // returns a promise
      console.log(`save user: ${JSON.stringify(user, null, 2)}`);
    }).then(token => {
      // when you start a header with x- you're creating a custom header
      // we can check if the token was generated checkin the x-auth variable in headers in postman
      res.header('x-auth', token).send(user.toJSON());
    }).catch(err => {
      res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);

  // WE WILL USE THE MIDDLEWARE TO  AUTHENTICATE
  // var token = req.header('x-auth'); // get the value of x-auth
  // User.findByToken(token).then(user => {
  //   if (!user) {
  //     return Promise.reject(); // invoque the catch method
  //   }

  //   res.send(user);
  // }).catch(e => {
  //   res.status(401).send()
  // });
});

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user);
    });
  }).catch(err => {
    res.status(400).send();
  })
});

app.listen(PORT, (res) => {
  console.log(`started up to port: ${PORT}`);
});

module.exports = {
  app,
};
