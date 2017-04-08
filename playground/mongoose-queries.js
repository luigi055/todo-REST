const { ObjectID } = require('mongodb'); // used to detect verification issues ids
const { moongose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Alternative to query data with find()
const id = '58e8511a1c77b82980edd9de1';


if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
};

// find() method
// Todo.find({
//   _id: id,
// }).then(todos => {
//   console.log('Todos', todos);
// });

// find one document at most
// this is preferred over find() since this returns an property document instead of an array o documents
// Todo.findOne({
//   _id: id,
// }).then(todo => {
//   console.log('Todo', todo);
// });

// findById() method. easier to find id of documents
// preferred over findOne() in the case to search for ids
// you can also find and invalid id with the catch method

// Todo.findById(id)
//   .then(todo => {
//     if (!todo) return console.log('Id not found');

//     console.log('Todo By Id', todo);
//   })
//   .catch(e => console.log(e));

// CHALLENGE
// find an id of an user.

const userId = '58e07d7543552f23ec438005';

User.findById(userId)
  .then(user => {
    if(!user) return console.log('User not found');
    console.log('User by Id', JSON.stringify(user, null, 2));
  })
  .catch(err => console.log(err));
  