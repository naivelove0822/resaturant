const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/Restaurant')
const bodyParser = require('body-parser')

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
app.use(bodyParser.urlencoded({ extende: true }))

// 首頁瀏覽全部餐廳
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})
// 搜尋功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()

  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render('index', { restaurantsData: filterRestaurantsData, keyword: keyword })
    })
    .catch(err => console.log(err))
})

// 新增餐廳功能
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  // 拿出全部資料所以使用req.body
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽單一餐廳資料
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id 
  return Restaurant.findById(id)
   .lean()
   .then((restaurantsData) => res.render('show', { restaurantsData: restaurantsData }))
   .catch(err => console.log(err))
})

// 修改餐廳資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurantsData) => res.render('edit', { restaurantsData: restaurantsData }))
    .catch(err => console.log(err))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id 
  const body = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = body.name 
      restaurant.name_en = body.name_en
      restaurant.category = body.category
      restaurant.image = body.image
      restaurant.location = body.location 
      restaurant.phone = body.phone 
      restaurant.google_map = body.google_map 
      restaurant.rating = body.rating 
      restaurant.description = body.description
      return restaurant.save()
    })
    .then(()=> res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))

  // Model answer 使用put方式 將原本的:id/edit => :restaurantId , Edit.hbs內改為<form action="/restaurants/{{restaurantsData._id}}?_method=PUT"

  // const { restaurantId } = req.params
  // Restaurant.findByIdAndUpdate(restaurantId, req.body)
  //   //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
  //   .then(() => res.redirect(`/restaurants/${restaurantId}`))
  //   .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Restaurant is running on localhost:${port}`)
})