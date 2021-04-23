'use strict';
if(process.env.NODE_ENV !== 'production') require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/people');
const app = express();


app.use(express.json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.static('build'));

app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body`));
morgan.token('body', req => JSON.stringify(req.body))
  

// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": "1"
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": "2"
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": "3"
//   },
//   {
//     "name": "Miguel",
//     "number": "99999",
//     "id": "4"
//   },
//   {
//     "name": "Juan",
//     "number": "12345",
//     "id": "5"
//   },
//   {
//     "name": "John Doe",
//     "number": "342423423",
//     "id": "6"
//   }
// ];

// get info about the API
app.get('/api/info', (req, res) => {
  const HTMLdata = `
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`;
  res.send(HTMLdata)
});

// endpoint for get all the contacts
app.get('/api/people', (req, res) => {
  Person.find({}).then(people => res.json(people))
});

// get only one contact provided an id
app.get('/api/people/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => res.json(person))
  .catch(err => res.status(404).send({
    message: 'not found contact with provided id'
  }));
});

// app.delete('/api/people/:id', (req, res) => {
//   const id = req.params.id;
//   persons = persons.filter(item => item.id !== id);
//   res.status(204).end();
// });

app.post('/api/people', (req, res) => {
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
  .catch(err => res.status(500).send({
    message: 'An error occurred the contact was not saved'
  }))
});


const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknow endpoint'})
}
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server listen on:', PORT));
