const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = 3000


app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')


app.get('/', (req, res) => {
  res.send('This is index page')
})
app.listen(port, () => {
  console.log(`Express server listen on port:${port}`)
})