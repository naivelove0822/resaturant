const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  //取得表單參數
  const { name, email, password, confirmPassword } = req.body
  //檢查是否註冊過
  User.findOne({ email }).then(user => {
    if (user) {
      console.log('User already exists')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    else {
      return User.create({
        name,
        email,
        password
      })
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
    }
  })
  .catch((err) => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout() // passport提供的函式，清除session。
  res.redirect('/users/login')
})

module.exports = router
