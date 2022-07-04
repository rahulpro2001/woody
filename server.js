//dotenv config
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//imports 
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const {userModel} = require("./schema");
const mongoose = require("mongoose");

//passport initialization for authentication
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  // email => users.find(user => user.email === email),
    null
  ,
//  id => users.find(user => user.id === id)
  null
)

//Using array for database
// const users = []

// database connection (mongoDB database)
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@cluster0.n5haz.mongodb.net/woodwork?retryWrites=true&w=majority`;
mongoose.connect(uri);


//app object using middlewares
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//home route
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})



//login and log-out routes
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login-register.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('login-register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // users.push({
    //   id: Date.now().toString(),
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: hashedPassword
    // })

    
    // userModel.findOne({email: email}, (err, doc)=>{
    //   if(err){
    //     return next(err);
    //   }
    //   if(doc){
    //     req.flash("registerfailed", "Email already registered.");
    //     res.redirect('/register');
    //   }
    //   else{
        const userDoc = new userModel({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        })
        userDoc.save((err)=>{
          if(err) return next(err); 
          else  res.redirect('/login');
        })
    //   }

    // })
   


  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})





//function for checking authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}





app.listen(3000)



