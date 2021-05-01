'use strict';
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const url = process.env.MONGODB_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(result => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB:', err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true
  } 
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

personSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('Person', personSchema);
