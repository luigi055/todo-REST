const expect = require('chai').expect;
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test Todo test';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token) // needed if our todo is private
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
      .set('x-auth', users[0].tokens[0].token) // needed if our todo is private
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
      .set('x-auth', users[0].tokens[0].token) // needed if our todo is private
      .expect(200)
      .expect(res => {
        // since the user just have created 1 todo 
        // (there is just one todo asociated with this authro)
        expect(res.body.todos.length).to.equal(1);
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(res => {
        expect(res.body.todo.text).to.be.equal(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc by other users', done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token) // get the second user but x-auth are bringing the first user token
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    // passing an VALID todo id that doesn't exist in the db
    const hexId = new ObjectID('58e9714021e8780ba4f8cf19').toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid', done => {
    request(app)
      // passing an invalid id
      .get(`/todos/123abc`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo doc', done => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      // toHexString() is a method to transform object id to string id
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) // comparing the first user with teh first todo
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).to.be.deep.equal(hexId);
      })
      .end((err, res) => {
        // We will connect to the server to check if the todo was
        // successfully removed
        if (err) return done(err);

        // query database Using findById
        Todo.findById(hexId).then(todo => {
          expect(todo).to.not.exist;
          done();
        }).catch(e => done(e));
      });
  });

  it('should NOT remove a todo doc of other users', done => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      // toHexString() is a method to transform object id to string id
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) // comparing the first user with teh first todo
      .expect(404)
      .end((err, res) => {
        // We will connect to the server to check if the todo was
        // successfully removed
        if (err) return done(err);

        // query database Using findById
        Todo.findById(hexId).then(todo => {
          expect(todo).to.exist;
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', done => {
    // passing an VALID todo id that doesn't exist in the db
    const hexId = new ObjectID('58e9714021e8780ba4f8cf19').toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) // needed if our todo is private
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid', done => {
    request(app)
      // passing an invalid id
      .delete(`/todos/123abc`)
      .set('x-auth', users[1].tokens[0].token) // needed if our todo is private
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo item', done => {
    // grab the id of first item
    // update the text, set completed true
    // status 200
    // text is changed, completed is true and completedAt is a number
    const hexId = todos[0]._id.toHexString();
    const text = 'update this todo text';
    // auth as first user
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token) // needed if our todo is private
      .send({
        completed: true,
        text,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).to.equal(text);
        expect(res.body.todo.completed).to.equal(true);
        expect(res.body.todo.completedAt).to.be.a('number');
      })
      .end(done);
  });

  it('should not update the todo item of others users', done => {

    const hexId = todos[0]._id.toHexString();
    const text = 'update this todo text';
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) // needed if our todo is private
      .send({
        completed: true,
        text,
      })
      .expect(404)
      .expect(res => {
        expect(res.body.todo).to.be.empty;
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    // grab id of second todo item
    // update text, set completed to false
    // 200
    // text is changed, completed is false, completedAt is null

    const hexId = todos[1]._id.toHexString();
    const text = 'update this todo text!!!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) // needed if our todo is private
      .send({
        completed: false,
        text,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).to.equal(false);
        expect(res.body.todo.text).to.equal(text);
        expect(res.body.todo.completedAt).to.not.exist;
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token) // set the header
      .expect(200)
      .expect((res) => {
        expect(res.body._id).to.equal(users[0]._id.toHexString());
        expect(res.body.email).to.be.equal(users[0].email);
      })
      .end(done);
  });

  it('should return the 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).to.be.empty;
      })
      .end(done);
  });

  it('should return the 401 if token is setted but not found for authentication', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', `${users[0].tokens[0].token} + 1`)
      .expect(401)
      .expect(res => {
        expect(res.body).to.be.empty;
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = '123mnb!';

    request(app)
      .post('/users')
      .expect(200)
      .send({
        email,
        password,
      })
      .expect(res => {
        expect(res.headers['x-auth']).to.exist; //use bracket notation since x-auth is not a valid js identifier
        expect(res.body._id).to.exist;
        expect(res.body.email).to.be.equal(email);
      })
      .end(err => {
        // connect to our db to search the user we created
        if (err) {
          return done(err);
        }

        User.findOne({ email }).then(user => {
          expect(user).to.exist;
          expect(user.password).to.not.equal(password); // since it should be hashed when sent to db
          done();
        }).catch(err => done(err));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: '1254sme',
        password: '123',
      })
      .expect(400)
      .end(done);
  });

  it('should not crate user if email in use', (done) => {

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password,
      })
      .expect(400)
      .end(done);
  });
})

describe('POST /users/login', () => {
  it('should login users and returns Auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).to.exist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).to.include({
            access: 'auth',
            token: res.headers['x-auth'],
          });
          done();
        }).catch(err => done(err));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: 'email',
        password: '123',
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).to.not.exist;
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).to.be.equal(1);
          done();
        }).catch(err => done(err));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on log out', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then(user => {
          expect(user.tokens[0]).to.be.empty
          done();
        }).catch(err => done(err))
      });
  });
});
