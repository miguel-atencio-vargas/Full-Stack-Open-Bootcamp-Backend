const express = require('express');
const app = express();


app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('tiny'));
}

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Miguel",
    "number": "99999",
    "id": "4"
  },
  {
    "name": "Juan",
    "number": "12345",
    "id": "5"
  },
  {
    "name": "John Doe",
    "number": "342423423",
    "id": "6"
  }
];

const genereteID = () => ''+Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);

app.get('/api/persons', (req, res) => res.json(persons));

app.get('/api/info', (req, res) => {
  const HTMLdata = `
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`;
  res.send(HTMLdata)
});

app.get('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  const person = persons.find(item=> item.id === id);
  if(!person) return res.status(404).end();
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = +req.params.id;
  persons = persons.filter(item => item.id !== id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if(!body.name || !body.number) return res.status(400).json({
    error: 'contact data is not provided'
  });
  const samePerson = persons.find(item => item.name.toLocaleLowerCase() === body.name.toLocaleLowerCase());
  if(samePerson) return res.status(400).json({
    error: `${body.name} is already registered. Name must be unique`
  });
  const newPerson = {
    id: genereteID(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson);
  res.json(newPerson);
});


const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknow endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server listen on:', PORT);
});
