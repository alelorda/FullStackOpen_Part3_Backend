
/*
 * importa el módulo de servidor web integrado de Node
 */
// const http = require('http')
/*
 * El codigo usa el método createServer del módulo http para crear un nuevo servidor web. 
 * Se registra un controlador de eventos en el servidor, que se llama cada vez que se realiza 
 * una solicitud HTTP a la dirección del servidor http://localhost:3001.
 */
// const app = http.createServer((request, response) => {
/* La solicitud se responde con el código de estado 200, con el header Content-Type establecido en text/plain. */
// response.writeHead(200, { 'Content-Type': 'text/plain' })
/* Contenido del sitio que se devolverá establecido en Hello World. */
//  response.end('Hello World')
// })
/* enlazan el servidor http asignado a la variable app, para escuchar las solicitudes HTTP enviadas al puerto 3001:*/
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
/* 
 * El valor application/json en el header Content-Type informa al receptor que los datos están en formato JSON. 
 * El array notes se transforma en JSON con el método JSON.stringify(notes).
 */
//   response.end(JSON.stringify(notes))
// })
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
   ]

let  persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    id: 5,
    name: "alexis",
    number: "1234"
  }
]

// Importamos express
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

morgan('tiny')
// Se crea una aplicación express almacenada en la variable app
const app = express() 
// Para acceder a los datos fácilmente se agrega json-parser para manejar las solicitudes HTTP POST:
app.use(express.json())
app.use(express.static('build'))
morgan.token("code", function getCode(req) {
  return JSON.stringify(req.body);
 });
 app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :code'))
//app.use(morgan(`:method :url :status :res[content-length] - :response-time ms {:response}`))
// app.use(morgan.token('type', function (req, res) { return req.headers['content-type'] }))
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
/*
 * Definimos dos rutas a la aplicación. El primero define un controlador de eventos, que se utiliza para manejar las solicitudes HTTP GET 
 * realizadas a la raíz / de la aplicación: La función del controlador de eventos acepta dos parámetros. El params request contiene toda la información de la 
 * solicitud HTTP y el param response se utiliza para definir cómo se responde a la solicitud. La solicitud se responde utilizando el método send del objeto response. 
 * Llamar al método hace que el servidor responda a la solicitud HTTP enviando una respuesta que contiene <h1>Hello World!</h1>, 
 * que se pasó al método send. Dado que el parámetro es un string, express establece automáticamente el valor del header Content-Type en text/html. 
 * El código de estado de la respuesta predeterminado es 200.
*/
app.get('/', (request, response) => {                 // Primera ruta
    response.send('<h1>Hello World!</h1>')
  })

// NOTES
app.get('/api/notes', (request, response) => {        // Segunda ruta
    response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const note = notes.find(note => note.id === Number(request.params.id))
  if (note) response.json(note)
  // status establece el estado y end responde la solicitud sin enviar ningun dato.
  response.status(404).end()
})

/*
 * notes.map(n => n.id) crea un nuevo array que contiene todos los ids de las notas. 
 * Math.max devuelve el valor máximo de los números que se le pasan. 
 * Sin embargo, notes.map(n => n.id) es un array, por lo que no se puede asignar directamente como 
 * parámetro a Math.max. El array se puede transformar en números individuales 
 * mediante el uso de la sintaxis de spread de los "tres puntos", ....
 */
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
app.delete('/api/notes/:id', (request, response) => {
  notes = notes.filter(note => note.id !== Number(request.params.id))
  /*
   * No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE, las únicas dos opciones son 204 y 404. 
   * Nuestra aplicación responderá con 204 en ambos casos.
   */
  response.status(204).end()
})

// PERSONS
app.get('/api/persons',(request, response)=>{
  response.json(persons)
})
app.get('/api/persons/:id',(request, response)=>{
  const res =persons.find(x=> x.id === Number(request.params.id))
  if(res) response.json(res)
  response.status(404).end()
})
app.delete('/api/persons/:id',(request, response)=>{
  persons = persons.filter(person => person.id !== Number(request.params.id))
  /*
   * No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE, las únicas dos opciones son 204 y 404. 
   * Nuestra aplicación responderá con 204 en ambos casos.
   */
  console.log(persons)
  response.status(204).end()
})
app.post('/api/persons',(request,response)=>{
  const {name, number} = request.body;

  if(!name || !number) {
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }

if(validationName(name, number)){
  return response.status(400).json({ 
    error: 'Name must be unique' 
  })
}

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
    id: Math.floor(Math.random() * 100)
  }
  persons.push(newPerson)
  response.json(persons)
})

// INFO
app.get('/api/info',(request, response)=>{
  response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${new Date()}</p>`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

function validationName(name, number) {
  return persons.find(
    (person) =>
      person.name === name || person.number === number
  );
};