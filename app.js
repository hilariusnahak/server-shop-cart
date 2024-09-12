const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const path = require('path')
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({credentials: true, origin: true}))

app.use('/img', express.static(path.join(__dirname, './public/img')))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const db = require('./app/models')
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useFindAndModify: false
})
.then((result) => {
  console.log('Database Connected!')
}).catch((err) => {
  console.log("Connot connect to database", err)
  process.exit()
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to vuestore-server'
  })
})

require('./app/routes/product.route')(app)
require('./app/routes/order.route')(app)

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})