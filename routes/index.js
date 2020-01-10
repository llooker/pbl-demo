'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')

router.get('/looker', indexCtrl.main)
router.get('/session', indexCtrl.session)
router.post('/writesession', indexCtrl.writeSession)

module.exports = router