'use strict';
require('dotenv').config();

module.exports = {
  'atom-fashion-2': {
    host: `/cloudsql/${process.env.DB_HOST}`,
    database: `${process.env.DB_NAME}`, // Create at step 3
    password: `${process.env.DB_PASSWORD}`,
    user: `${process.env.DB_USERNAME}`,
    name: `${process.env.DB_NAME}`,
    connector: 'postgresql',
  },
};