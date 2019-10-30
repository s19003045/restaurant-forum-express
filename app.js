const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const db = require('./models')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Express server listen on port:${port}`)
})

require('./routes')(app)
