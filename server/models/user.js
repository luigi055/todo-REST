const mongoose = require('mongoose');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// our user model scructure
// {
// steps to validate out user
// email: "luigi@email.com",
// password: "abc123", // we have to hash this. we'll use bcrypt
// tokens [{
// access: 'auth',
// token: 'rfgasg4g64g9684rg89',
//}] // this will be an array of authentication tokens
// }
// consult the mongoose custom validation for further info about custom validation

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, // verifies if the email value havent been setted before
    validate: {
      validator: isEmail,
      message: '{VALUE} is not a valid email', // {VALUE} injects the name of the value passed in
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }],
});

userSchema.methods.toJSON = function convertToJSON() {
  const user = this;
  const userObject = user.toObject() // toObject is a mongoose method that transform data to js object

  // we just goint to pass in id and email since is the data we can show
  // password and tokens must be hidden!!
  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function generateToken() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

  user.tokens.push({
    access,
    token,
  });

  // returns a promise
  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  // chaining the promise
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject(); // activate .catch()
    }

    // since bcrypt only support callback functions and we want to use promises
    // we're going to wrap that bcrypt with a new promise
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to comprare password with user-password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(err);
        }
      });
    })
  });
}

userSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token, // if this token is equal to the token passed in from the arguments. will remove this
      }
    }
  });
}

userSchema.statics.findByToken = function (token) {
  var User = this; // User with capitalized U
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token, // we're redifining tokens.token
    'tokens.access': 'auth',
  });
}

// Mongoose middleware before save (event) the document
userSchema.pre('save', function (next) {
  var user = this;

  var userModified = user.isModified('password'); // Boolean

  if (userModified) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }

});

const User = mongoose.model('user', userSchema);

module.exports = {
  User,
}