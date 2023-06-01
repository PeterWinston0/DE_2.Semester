const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1024
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  dropbox: {
    type: String,
  },
  github: {
    type: String,
  },
  techs: [{
    name: {
      type: String,
    },
  }],
  tasks: {
    type: Object,
    default: {
      todo: [],
      doing: [],
      done: [],
    },
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;