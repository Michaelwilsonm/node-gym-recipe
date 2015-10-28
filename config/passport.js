var LocalStrategy = require('passport-local').Strategy
var User = require('../app/model/user')
var configAuth = require('./auth')
var FacebookStrategy = require('passport-facebook').Strategy

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
      process.nextTick(function(){
      User.findOne({'local.username': email}, function(err, user){
        if (err)
          return done(err)
        if(user){
          return done(null, false, req.flash('signupMessage', 'already taken'))
        } else {
          var newUser = new User()
          newUser.local.username = email
          newUser.local.password = password

          newUser.save(function(err){
            if (err)
              throw err
            return done(null, newUser)
          })
        }
      })
    })
  }))

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.username': email}, function(err, user){
        if(err)
          return done(err)
        if(!user)
          return done(null, false)
        if(user.local.password != password) {
          return done(null, false)
        }
        return done(null, user)
      })
    })
  }))
  passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      console.log('profile:', profile)
      User.findOne({'facebook.id': profile.id}, function(err, user){
        if(err)
          return done(err)
        if(user)
          return done(null, user)
        else {
          var newUser = new User()
          newUser.facebook.id = profile.id
          newUser.facebook.token = profile.Token
          newUser.facebook.name = profile.displayName
          // newUser.facebook.email = profile.emails.value

          newUser.save(function(){
            if(err)
              throw err
            return done(null, newUser)
          })
        }
      })
    })
  }));
}