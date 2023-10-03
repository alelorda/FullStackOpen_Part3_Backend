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

// lee las variables de entorno
require('dotenv').config()
// Importamos express
const express = require( 'express' )
const morgan = require('morgan')
morgan('tiny')
const Note = require('./models/note')
const Person = require('./models/phonebook')

const cors = require('cors')

// Se crea una aplicación express almacenada en la variable app
const app = express()
// Para acceder a los datos fácilmente se agrega json-parser para manejar las solicitudes HTTP POST:
app.use(express.json())
app.use(express.static('build'))
morgan.token('code', function getCode(req) {
  return JSON.stringify(req.body)
})
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :code'))
//app.use(morgan(`:method :url :status :res[content-length] - :response-time ms {:response}`))
// app.use(morgan.token('type', function (req, res) { return req.headers['content-type'] }))
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
//app.use(requestLogger)
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
{
  app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })
  // app.get('/api/notes/:id', (request, response) => {
  //   const note = notes.find(note => note.id === Number(request.params.id))
  //   if (note) response.json(note)
  //   // status establece el estado y end responde la solicitud sin enviar ningun dato.
  //   response.status(404).end()
  // })
  app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
      response.json(note)
    })
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
  app.post('/api/notes', (request, response,next) => {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
    // Constructor
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })

    note.save().then(savedNote => savedNote.toJSON())
      .then(savedAndFormattedNote => {
        response.json(savedAndFormattedNote)
      }).catch(error => next(error))
  })
  app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
      content: body.content,
      important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })
  app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        /*
   * No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE, las únicas dos opciones son 204 y 404.
   * Nuestra aplicación responderá con 204 en ambos casos.
   */
        response.status(204).end()
      })
      .catch(error => next(error))
  })
}

// PERSONS
{
  app.get('/api/persons',(request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })
  app.get('/api/persons/:id',(request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => {
      // console.log(error)
      // response.status(400).send({ error: 'malformatted id' })}
        next(error)
      })
  })
  app.delete('/api/persons/:id',(request, response,next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        /*
   * No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE, las únicas dos opciones son 204 y 404.
   * Nuestra aplicación responderá con 204 en ambos casos.
   */
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  app.post('/api/persons',(request,response,next) => {
    const { name, number } = request.body

    if(!name || !number) {
      return response.status(400).json({
        error: 'Name or number missing'
      })
    }

    // if(validationName(name, number)){
    //   return response.status(400).json({
    //     error: 'Name must be unique'
    //   })
    // }

    // Constructor
    const newPerson = new Person({
      name: name,
      number: number,
    })
    newPerson.save().then(savedPerson => response.json(savedPerson))
      .then((saveNewPerson) => {
        response.json(saveNewPerson)
      }).catch(error => next(error))
  })
}

// INFO
{
  app.get('/api/info',(request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${new Date()}</p>`)
  })
}

/*
 * El orden de ejecución del middleware es el mismo que el orden en el que se cargan en express con la función app.use.
 * Por esta razón, es importante tener cuidado al definir el middleware.
 * El orden correcto es el siguiente: 1° unknownEndpoint - 2° errorHandler
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// Los manejadores de errores de Express son middleware que se definen:
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

function validationName(name, number) {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}