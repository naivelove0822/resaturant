const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/Restaurant')

// 新增餐廳功能
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  // 拿出全部資料所以使用req.body
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽單一餐廳資料
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurantsData) => res.render('show', { restaurantsData: restaurantsData }))
    .catch(err => console.log(err))
})

// 修改餐廳資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurantsData) => res.render('edit', { restaurantsData: restaurantsData }))
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => console.log(err))

  // Model answer 
  // const { restaurantId } = req.params
  // Restaurant.findByIdAndUpdate(restaurantId, req.body)
  //   //可依照專案發展方向自定編輯後的動作，這邊是導向到瀏覽特定餐廳頁面
  //   .then(() => res.redirect(`/restaurants/${restaurantId}`))
  //   .catch(err => console.log(err))
})

// 刪除餐廳功能
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))

  // Model Answer作法
  // app.delete("/restaurants/:restaurantId", (req, res) => {
  //   const { restaurantId } = req.params
  //   Restaurant.findByIdAndDelete(restaurantId)
  //     .then(() => res.redirect("/"))
  //     .catch(err => console.log(err))
})
module.exports = router