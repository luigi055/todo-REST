const { ObjectID } = require('mongodb'); // used to detect verification issues ids
const { moongose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove(); if you want to remove everything in your collection pass just {} as argument

// Todo.remove({}).then(result => {
//   // console.log(result)
//   console.log(result.result)
// });

// other method to remove documents with mongoose
// findONeAndRemove()
Todo.findOneAndRemove({ _id: '58e9847c457d747a90a41c16'}).then(doc => {
  console.log(doc);
});

// findByIdAndRemove()

// Todo.findByIdAndRemove('58e98447457d747a90a41c03').then(todo => {
//   console.log(todo);
// });