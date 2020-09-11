const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
let mongoDB = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster1.97hzq.gcp.mongodb.net/pbl-demo
`
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var sess = {
  secret: 'keyboard catv1.0.3',
  cookie: {
    // expires: new Date(Date.now() + 3600000), //hour
    maxAge: 14 * 24 * 3600000 //two weeks
    // maxAge: 5000 //58 * 60 * 1000
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

const port = process.env.PORT || 5000;

let routes = require('./routes/index')
app.use('/', routes)

//https://medium.com/@paulrohan/deploying-a-react-node-mongodb-app-to-google-cloud-platforms-google-app-engine-1ba680447d59
if (process.env.NODE_ENV === 'production') {
  //https://stackoverflow.com/questions/41944776/force-ssl-on-app-engine-flexible-environment-custom-runtime/48085977#48085977
  //5 upvoted asnswer
  app.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === "http") {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
  });

  app.use(express.static(path.join(__dirname, 'client/build')))

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
else console.log('elllse')


app.listen(port, () => console.log(`Example app listening on port ${port}!`))