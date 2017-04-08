const expect = require('chai').expect;
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First Test Todo',
  }, {
    _id: new ObjectID(),
    text: 'Second Test Todo',
  }
];

beforeEach(done => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); // clean the database before each test and send dummy database info
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test Todo test';

    request(app)
      .post('/todos')
      .send({
        text,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).to.equal(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        // fecth all the todos
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).to.be.equal(1);
            expect(todos[0].text).to.be.equal(text);
            done();
          })
          .catch(error => done(error));
      });
  });

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).to.equal(2);
            done();
          })
          .catch(error => done(error));
      })
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).to.equal(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      // toHexString() is a method to transform object id to string id
      .get(`/todos/${todos[0]._id.toHexString()}`) 
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).to.be.equal(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    // passing an VALID todo id that doesn't exist in the db
    const hexId = new ObjectID('58e9714021e8780ba4f8cf19').toHexString();
    request(app)
      .get(`/todos/${hexId}`) 
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid', done => {
    request(app)
      // passing an invalid id
      .get(`/todos/123abc`) 
      .expect(404)
      .end(done);
  });
});