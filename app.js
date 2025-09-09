const express = require('express');
const path = require('path');
const route = require('./routes/route');
const apiRoute = require('./api/routes/pageRoutes');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken");
const mongoose = require('./db/db'); 
const cors = require('cors'); 

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors());
dotenv.config({ path: "./config.env" });
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(upload());

app.use(express.json());
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false
}));app.use(cookieParser());

app.set('layout', 'partials/layout-vertical');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', route);
app.use('/api', apiRoute);

app.use((err, req, res, next) => {
  let error = { ...err }
  if (error.name === 'JsonWebTokenError') {
    err.message = "please login again";
    err.statusCode = 401;
    return res.status(401).redirect('view/login');
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'errors';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,

  })
});


const http = require("http").createServer(app);
http.listen(process.env.PORT ?? 8001, () => console.log(`Server is listening on address http://localhost:${process.env.PORT ?? 8001}/`))