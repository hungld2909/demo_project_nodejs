const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('../configs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)

    if (!user) return done(null, false)

    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

// passport local
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {

  try {
    const user = await User.findOne({ email })

    //k co use thi return
    if (!user) return done(null, false)

    // so sanh password nguoi dung gui len voi server 
    const isCorrectPassword = await user.isValidPassword(password)

    if (!isCorrectPassword) return done(null, false) // k dang nhap duoc

    done(null, user)

  } catch (error) {
    next(error, false)
  }

}))