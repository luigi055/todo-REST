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

  // deleteMany
  // delete all the coincidences

  // db.collection('Todos').deleteMany({ text: 'Walk the dog'}).then(result => {
  //   console.log(JSON.stringify(result, null, 2));
  // });

  // deleteOne
  // similar to deleteMany but just remove the first coincidences

  // db.collection('Todos').deleteOne({ text: 'Eat Lunch'}).then(result => {
  //   console.log(JSON.stringify(result, null, 2));
  // })

  // findOneAndDelete (favorite)
  // This first find the first coincidenced document and then delete it
  // db.collection('Todos').findOneAndDelete({ completed: true }).then(result => {
  //   console.log(result)
  // });

  // deleting by id
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('58e06111224848bbd0a6d79c')
  }).then(result => {
    console.log(result);
  });

  db.collection('Users').deleteMany({ name: 'Pedro La Rosa'}).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });

  // close connection
  // db.close();
});