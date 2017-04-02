const mongoose = require('mongoose');

// mongoose support callback but we can configure to use promise like:
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose,
};
