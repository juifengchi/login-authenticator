const express = require('express')
const exphbs = require('express-handlebars')
const checkAccount = require('./check_account')

const app = express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/login', (req, res) => {
  const result = checkAccount(req.body)
  const email = req.body.email
  if (result.firstName) return res.render('login', { result })
  res.render('index', { email, result })
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
