const mongoose = require('mongoose');

// mongoose support callback but we can configure to use promise like:
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
  mongoose,
};
