require('dotenv').config()
const path = require("path");
const express = require('express')
const db=require('./config/database')
const bodyParser=require('body-parser')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const cors=require('cors')



const setMiddlewares = require('./middleware/middleware')
const setRoutes = require('./route/route')

const app = express()
app.use(cors());


app.set('view engine', 'ejs')
app.set('views')
app.use(express.static('public'));

app.use(
  session({
    secret: 'dls_admin_login_secret',
    resave: true,
    saveUninitialized: true,
  })
);



app.use(cookieParser());

setMiddlewares(app)
setRoutes(app)





db.connect(function (err) {
    if (err) {
      return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server");
  });

const PORT = process.env.PORT || 1000

app.listen(PORT,()=>{
    console.log("Server created success")
})
