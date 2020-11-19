const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);



require('dotenv').config();
let pgPool;
// let knex;
if (process.env.NODE_ENV === 'production') {
  pgPool = new pg.Pool({
    // Insert pool options here
    database: process.env.POSTGRES_DATABASE_NAME,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
  });
} else {
  pgPool = new pg.Pool({
    // Insert pool options here
    database: process.env.POSTGRES_DATABASE_NAME,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
    host: process.env.POSTGRES_IP_ADDRESS,
  });
}

const sess = {
  secret: 'keyboard catv1.0.4',
  resave: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days,
  store: new pgSession({
    pool: pgPool,                // Connection pool
    tableName: 'session'   // Use another table-name than the default "session" one
  }),
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))