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

  // CREATING DOCUMENTS
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: true,
  // }, (error, result) => {
  //   if (err) {
  //     return console.log('Unable to insert Todo');
  //   }

  //   console.log(JSON.stringify(result.ops, null, 2));
  // });

  // Insert new doc into Users (name, age, location);
  db.collection('Users').insertOne({
    name: 'Pedro La Rosa',
    age: 26,
    location: 'San Carlos - Cojedes',
  }, (error, result) => {
    if (err) {
      return console.log('Unable to insert User');
    }

    console.log(JSON.stringify(result.ops, null, 2));
    console.log('Object Id was created on: ' + JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2));
  });

  db.close();
});