const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant.json').results //引入JSON檔
const db = require('../../config/mongoose')
const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    seed_restaurant: restaurantList.slice(0, 3) //加入指定餐廳 
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    seed_restaurant: restaurantList.slice(3, 6)
  }
]


db.once('open', () => {
  Promise.all(Array.from(SEED_USER, seed_user => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed_user.password, salt))
      .then(hash => User.create({
        name: seed_user.name,
        email: seed_user.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        seed_user.seed_restaurant.forEach(seed => {
          seed.userId = userId
        })
        return Restaurant.create(seed_user.seed_restaurant)
      })
  }))
    .then(() => {
      console.log('done')
      process.exit()
    })
    .catch(err => console.log(err))
})
