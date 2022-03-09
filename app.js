const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

const Restaurant = require('./models/Restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const routes = require('./routes')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extende: true }))
app.use(methodOverride('_method'))
app.use(routes)

require('./config/mongoose')


app.listen(port, () => {
  console.log(`Restaurant is running on localhost:${port}`)
})