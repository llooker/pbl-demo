var app = require('express')();
var bodyParser = require('body-parser');
var session = require('express-session');
var sess = {
    secret: 'keyboard cat',
    cookie: {
        //expires: new Date(Date.now() + 3600000), //hour
        maxAge: 14 * 24 * 3600000 //two weeks
    },
    userProfile: {} //not working
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));


const port = 5000
let routes = require('./routes/index')
app.use('/', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))