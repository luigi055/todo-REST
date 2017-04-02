const expect = require('chai').expect;
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

beforeEach(done => {
  Todo.remove({}).then(() => done()); // clean the database before each test
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
        Todo.find()
          .then(todos => {
            expect(todos.length).to.be.equal(1);
            expect(todos[0].text).to.be.equal(text);
            done();
          })
          .catch(error => done(error));
      })
  });

  it('should not create todo with invalid body data', (done) => {
    const text = '';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(400)
      .expect(res => {
        expect(res.body.text).to.not.equal(text);
      })
      .end((err, res) => {
        if (err) return done(err);

        Todo.find()
          .then(todos => {
            expect(todos.length).to.equal(0);
            done();
          })
          .catch(error => done(error));
      })
  });
});