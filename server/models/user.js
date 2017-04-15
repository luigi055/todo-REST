const mongoose = require('mongoose');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({
    access,
    token,
  });

  // returns a promise
  return user.save().then(() => {
    return token;
  });
};

const User = mongoose.model('user', userSchema);

module.exports = {
  User,
}