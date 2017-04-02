// const MongoClient = require('mongodb').MongoClient;
//ObjectID constructor generate ids similar to node-uid
const { MongoClient, ObjectID } = require('mongodb');

let obj = new ObjectID();
console.log(obj);

// When connecting to the mongo db server we don't need to create
// Our new db in the cli, we can just create that here by simple
// Write that the follow:
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    // return the value to stop the execution of the function right here if 
    // the condition is truthy
    return console.log('enable to connect to mongodb server');
  }

  console.log('Connected to MongoDB Server');

// Check the documentation for findOneAndUpdate method
  db.collection('Todos').findOneAndUpdate({ 
    _id: new ObjectID('58e05e09224848bbd0a6d5ef')
  }, {
    $set: {
      text: 'change this from mongodb',
    }
  }, {
    returnOriginal: false,
  })

// Incremente the age of one document
  db.collection('Users').findOneAndUpdate({ 
    _id: new ObjectID('58e0394f8b6c152670bc64d3')
  }, {
    $set: {
      name: 'Pedro La Rosa',
    },
    $inc: { // check update operators
      age: +1,
    }
  }, {
    returnOriginal: false,
  }).then(res => {
    console.log(res);
  });

  // db.close();
});