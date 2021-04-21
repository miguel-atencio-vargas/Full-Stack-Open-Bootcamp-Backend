const express = require('express');
const app = express();
app.use(express.json());
const persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Miguel",
    "number": "99999",
    "id": 4
  },
  {
    "name": "Juan",
    "number": "12345",
    "id": 5
  },
  {
    "name": "John Doe",
    "number": "342423423",
    "id": 6
  }
];

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
})


const PORT = 3001;
app.listen(PORT, () => {
  console.log('Server listen on:', PORT);
})