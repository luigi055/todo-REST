// const MongoClient = require('mongodb').MongoClient;
//ObjectID constructor generate ids similar to node-uid
const { MongoClient, ObjectID } = require('mongodb');


// When connecting to the mongo db server we don't need to create
// Our new db in the cli, we can just create that here by simple
// Write that the follow:
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('enable to connect to mongodb server');
  }
  
  console.log('Connected to MongoDB Server');

  // db.collection('Todos').find({ completed: false }).toArray().then((docs)=> {
  //   console.log(`Todos:`);
  //   console.log(JSON.stringify(docs, null, 2));
  // }, err => {
  //   console.log('Unable to fetch todos', err);
  // });

  // Find an id
  // db.collection('Todos').find({ 
  //   _id: new ObjectID('58e033b4531ddb235cb07cba'), // looking for this id property 
  // }).toArray().then((docs)=> {
  //   console.log(`Todos:`);
  //   console.log(JSON.stringify(docs, null, 2));
  // }, err => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({ name: 'Jen' }).toArray().then(docs => {
    console.log(`name: ${JSON.stringify(docs, null, 2)}`);
  }, err => {
    console.log('Unable to fetch data', err);
  })

  // counting documents
  // db.collection('Users').find().count().then((count)=> {
  //   console.log(`Todos count: ${count}`);
  // }, err => {
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({ name: 'Pedro La Rosa' }).count().then((count)=> {
    console.log(`Todos count: ${count}`);
  }, err => {
    console.log('Unable to fetch todos', err);
  });

  // close connection
  // db.close();
});