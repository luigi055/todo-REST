const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'luigi@example.com',
  password: 'userOnepass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString(),
  }],
}, {
  _id: userTwoId,
  email: 'luigi2@example.com',
  password: 'userTwopass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
  }],
}];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First Test Todo',
    _creator: userOneId,
  }, {
    _id: new ObjectID(),
    text: 'Second Test Todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
  }
];

// this functions will be specifically to use with mocha
const populateTodos = done => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); // clean the database before each test and send dummy database info
}

const populateUsers = done => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done()); // clean the database before each test and send dummy database info
}

module.exports = { todos, users, populateTodos, populateUsers };