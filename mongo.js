'use strict';
const mongoose = require('mongoose');



if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}


const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://fullstack_user:${password}@cluster0.2w4jk.mongodb.net/phonebook-app?retryWrites=true`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if(!name || !number) {
  console.log('phonebook');
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  const person = new Person({ name, number });
  person.save().then(result => {
    // change the format output
    console.log(`added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close()
  })
}

