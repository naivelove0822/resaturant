const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connect')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// 首頁瀏覽全部餐廳
app.get("/", (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})

// app.get('/restaurant/:restaurant_id', (req, res) => {
//   const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
//   res.render('show', { restaurant: restaurant })
// })

// app.get('/search', (req, res) => {
//   const keyword = req.query.keyword.toLowerCase()
//   const restaurants = restaurantList.results.filter(restaurant => {
//     return restaurant.name.toLowerCase().trim().includes(keyword) || restaurant.category.toLowerCase().trim().includes(keyword) 
//   })
//   res.render('index', { restaurant: restaurants, keyword: keyword })
// })

app.listen(port, () => {
  console.log(`Restaurant is running on localhost:${port}`)
})