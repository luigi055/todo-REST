const mongoose = require('mongoose');

// Todo model will be represent a Todo document
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
    // required: true,
  },
  completedAt: {
    type: Number,
    default: null,
    // required: true,
  },
});

module.exports = { 
  Todo 
};
