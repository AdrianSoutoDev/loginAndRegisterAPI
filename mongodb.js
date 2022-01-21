const mongoose = require('mongoose')
const config = require('./config.js')

// añadir +srv para auenticacion con user y pasword
const connectionString = config.MONGO_DB_URI

// añadir opciones
// conexión a mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
