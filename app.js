const express = require('express')
const app = express()

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式，使用 dotenv 讀取 .env 檔案
  require('dotenv').config()

}

const exphbs = require('express-handlebars')
const port = process.env.PORT || 3000
const db = require('./models')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: require('./config/handlebars-helper.js') }))
app.set('view engine', 'handlebars')


app.use(session({ secret: 'DennyJohnAbby', resave: false, saveUninitialized: false }))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.static('public'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')

  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`Express server listen on port:${port}`)
})

require('./routes')(app, passport)
