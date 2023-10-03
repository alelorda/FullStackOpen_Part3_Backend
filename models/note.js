const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB - Note Models')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
// Validación disponible en Mongoose.
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
    unique:true
  },
  date: { 
    type: Date,
    required: true
  },
  important: Boolean
})
noteSchema.plugin(uniqueValidator);

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Note', noteSchema)