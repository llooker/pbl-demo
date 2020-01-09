'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')

router.get('/looker', indexCtrl.main)

module.exports = router