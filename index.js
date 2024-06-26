const express = require("express");
const morgan = require('morgan')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.static('dist'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }

  response.json(person);
});


app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }


  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random()*99999),
  };

  persons = persons.concat(person);

  response.json(persons);
});

app.get("/info", (request, response) => {
  const number = persons.length;
  const now = new Date();

  response.send(
    `<div>
      <p>Phonebook has info for ${number} people</p>
      <p>${now}</p>
    </div>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)


  persons = persons.filter(person => person.id !== id)


  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
