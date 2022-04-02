const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  //取得表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填!' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  //檢查是否註冊過
  User.findOne({ email }).then(user => {
    if (user) {
      req.flash('warning_msg', '此Email已註冊過。')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)//產生鹽
      .then(salt => bcrypt.hash(password, salt)) //指定將密碼加鹽，產生雜湊
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout() // passport提供的函式，清除session。
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
