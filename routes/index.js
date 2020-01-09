'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')

router.get('/home', indexCtrl.main)
router.get('/login', indexCtrl.auth)

module.exports = router