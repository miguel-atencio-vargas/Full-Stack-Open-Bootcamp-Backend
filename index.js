'use strict';
if(process.env.NODE_ENV !== 'production') require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/people');
const app = express();


app.use(express.static('build'));
app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---')
  next();
}
app.use(requestLogger);
  


// get info about the API

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(counter => {
      console.log(counter);
      const HTMLdata = `
        <p>Phonebook has info for ${counter} contacts.</p>
        <p>${new Date()}</p>`;
      res.send(HTMLdata)
    });
});


// endpoint for get all the contacts
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => res.json(people))
});

// get only one contact provided an id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(!person) return res.status(404).send({ message: 'Contact not found'});
      res.json(person);
    })
    .catch(err => next(err));
});

// delete a contact with a valid id provided
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      if(!result) return res.status(404).send({ message: 'Contact not found'});
      res.status(204).end();
    })
    .catch(err => next(err));
});

// create a new contact with required values
app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if(!body.name || !body.number) return res.status(400).json({
    error: 'contact data is not provided'
  });
  const person = new Person({
    name: body.name,
    number: body.number
  });
  person.save()
    .then(person => res.json(person))
    .catch(err => next(err));
});

// update a contact with a valid ID provided
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  if(!body.name || !body.number) return res.status(400).send({
    message: 'data not provided'
  });
  const options = { 
    new: true, 
    runValidators: true, 
    context: 'query'
  }
  const contact = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, contact, options)
    .then(newPerson => {
      if(!newPerson) return res.status(404).send({
        message: 'Contact not found'
      });
      res.json(newPerson);
    })
    .catch(err => next(err));
});

const unknownEndpoint = (req, res) => res.status(404).send({
  error: 'unknown endpoint'
});
app.use(unknownEndpoint);

const errorHandler = (exception, req, res, next) => {
  const { name, value, reason, message} = exception;
  console.log('Name:', name);
  console.log('Value:', value);
  const errorMessage = reason || message;
  console.log('Reason:', String(errorMessage));
  let error;
  if(name === 'CastError') error = 'Malformatted ID';
  if(name === 'ValidationError') error = errorMessage;
  if(error) return res.status(400).send({ error, name });
  next(exception);
}
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server listen on:', PORT));

