const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.js');

// console.log('000 process.env.NODE_ENV', process.env.NODE_ENV)
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
console.log('111 process.env.NODE_ENV', process.env.NODE_ENV)

require('dotenv-flow').config({
    path: './config'
});

console.log('LOOKER_HOST from env: ', process.env.LOOKER_HOST)


var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

let mongoDB;
//not working for now :(
// if (process.env.NODE_ENV === 'development') {
//     mongoDB = `mongodb://127.0.0.1/wysiwyg`
// } else {
mongoDB = `mongodb+srv://${config.mongo.username}:${config.mongo.password}@cluster0-97hzq.mongodb.net/wysiwyg`
//}
console.log('mongoDB', mongoDB)

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var sess = {
    secret: 'keyboard cat',
    cookie: {
        // expires: new Date(Date.now() + 3600000), //hour
        maxAge: 14 * 24 * 3600000 //two weeks
    },
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    // userProfile: {} //not working
}

// console.log('sess', sess)
// console.log('session', session)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// var port = process.env.PORT;
// console.log('process', process)
// console.log('process.env.PORT', process.env.PORT)
const port = 5000; // || process.env.PORT;
console.log('port', port)
let routes = require('./routes/index')
app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))