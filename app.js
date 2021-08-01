const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const User = require('./models/user')
const session = require('express-session')

const app = express()

mongoose.connect('mongodb://localhost/account-login', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: false
  })
)

app.get('/', (req, res) => {
  const _id = req.session._id
  if (!_id) return res.render('index')

  User.findOne({ _id })
    .lean()
    .then(user => {
      res.render('welcome', { user })
    })
    .catch(error => console.log(error))
})

app.post('/', (req, res) => {
  const input = req.body
  User.findOne(input)
    .lean()
    .then(user => {
      if (!user) {
        const alert = 'Email or password is incorrect!'
        return res.render('index', { input, alert })
      }

      req.session._id = user._id
      res.render('welcome', { user })
    })
    .catch(error => console.log(error))
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  console.log(req.session)
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
