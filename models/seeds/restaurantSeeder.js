const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results //引入JSON檔
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('running restaurantSeeder script...')

  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done')
      db.close()
    })
    .catch(err => console.log(err))
})
