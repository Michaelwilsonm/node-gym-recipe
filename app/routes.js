var User = require('./model/user')

module.exports = function(app, passport){
  app.get('/', function(req, res) {
    res.render('index.ejs')
  })

  app.get('/login', function(req, res){
    res.render('login.ejs', { message: req.flash('loginMessage')})
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/signup', function(req, res){
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get ('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', { user: req.user })
  })

  app.get('/logout', function(req, res){
    req.logout()
    res.redirect('/')
  })

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'public_profile,email'}));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  });

  app.get('/recipe', isLoggedIn, function(req, res){
    res.render('recipe.ejs', { user: req.user })
  })

  app.post('/recipe' function(req, res){
    var title = req.body.title
    var description = req.body.description
    console.log(description)
    console.log(title)
  })
}

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}