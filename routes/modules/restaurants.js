const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/Restaurant')

// 新增餐廳功能
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  // 區分個人頁面
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  // 拿出全部資料本來用req.body => 全部有需要的資料都需要打出來 && 思考可以包在一起的做法
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 瀏覽單一餐廳資料
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantsData) => res.render('show', { restaurantsData: restaurantsData }))
    .catch(err => console.log(err))
})

// 修改餐廳資料
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurantsData) => res.render('edit', { restaurantsData: restaurantsData }))
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const body = req.body
  return Restaurant.findOne({ _id, userId })
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
    .then(() => res.redirect(`/restaurants/${_id}`)) //這裡要改成_id才能根據使用者對應資料庫
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
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
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