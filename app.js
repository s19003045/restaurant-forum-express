const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'DennyJohnAbby', resave: false, saveUninitialized: false }))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')

  next()
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`Express server listen on port:${port}`)
})

require('./routes')(app)
