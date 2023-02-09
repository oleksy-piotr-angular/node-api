//define how Task should looks like
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  created: {type: String, required: true},
  end: {type: String, required: false},
  isDone: {type: Boolean, required: true},
});

module.exports = mongoose.model('Task', taskSchema);// export Mongoose schema with name 'Task'