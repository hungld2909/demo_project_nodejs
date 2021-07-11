//Config env
require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const userRoute = require('./routes/user')
const deckRoute = require('./routes/deck')
const app = express()
const mongoClient = require('mongoose')
const bodyParser = require('body-parser')
const secureApp = require('helmet')
//! kết nối với DB (mongodb by mongoose)
mongoClient.connect('mongodb://localhost/nodejsapistarter', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connect database success'))
  .catch((error) => console.error(`connec faild with error which is ${error}`))

//! Middlewares : nó nằm ở giữ client gửi lên và server xử lý. do đó nó sẽ chạy trước
// log ra toàn bộ thông tin server chạy
app.use(logger('dev'))
app.use(bodyParser.json()) // sử dụng thằng này để gửi gửi lên dưới dạng json
//! security for app
app.use(secureApp())
//Routes
app.use('/users', userRoute)
app.use('/decks', deckRoute)

//! try catch 404 Errors and forward them to error
//Bắt lỗi
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

//! Error handler function
app.use((req, res, next) => {
  const error = app.get('env') === 'development' ? err : {}
  const status = err.status || 500

  // response to client
  return res.status(status).json({
    error: {
      message: error.message
    }
  })
})

//! Start the server :
// chay server tren cong 3000
const port = app.get('port') || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))

