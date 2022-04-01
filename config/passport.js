const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  //初始化 passsport模組
  app.use(passport.initialize())
  app.use(passport.session())
  //設定本地登入政策
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email })
    .then(user => {
      if (!user) {
        return done(null, false, req.flash('error', 'User not register!'))
      }
      if (user.password !== password) {
        return done(null, false, req.flash('error', 'Email or password not correct!'))
      }
      return done(null, user)
    })
    .catch(err => done(err, false))
  }))
  //設定序列化與反序列化
  passport.serializeUser((user, done) => { 
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}