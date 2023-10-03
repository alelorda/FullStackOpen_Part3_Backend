const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

mongoose.connect(url).then( () => {
  console.log('connected to MongoDB - PhoneBook Models')
})
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message} - PhoneBook Models'`)
  })

const personSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    minlength: 3,
    unique:true
  },
  number:{
    type:String,
    required: true,
    minlength: 3,
    unique:true
  },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)
