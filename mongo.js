const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url = `mongodb+srv://fullstack:${password}@cluster0.fldmyjv.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.set("strictQuery", false);
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)
const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true,
  })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })  
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
const Person = mongoose.model('Person', personSchema)
if(name && number){
    
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result =>{
        console.log('Person saved!')
        mongoose.connection.close()
    })
}
else{
Person.find({}).then(result => {
    console.log('phonebook')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
      console.log(`${person.id}`);
    })
    mongoose.connection.close()
  })
}


// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })

//   Note.find({important:true}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })

  