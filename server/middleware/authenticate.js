const { User } = require('./../models/user');

// this will be the fucntion middleware to make our raoutes private
var authenticate = (req, res, next) => {
  var token = req.header('x-auth'); // get the value of x-auth
  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject(); // invoque the catch method
    }

    req.user = user;
    req.token = token;
    next();

  }).catch(e => {
    res.status(401).send()
  });
};

module.exports = authenticate;