'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')
const customizeCtrl = require('../controllers/customizeController')

router.get('/looker', indexCtrl.main)
router.get('/readsession', indexCtrl.readSession)
router.post('/writesession', indexCtrl.writeSession)

router.get('/customize', customizeCtrl.main)
router.post('/savecustomization', customizeCtrl.saveCustomization)

module.exports = router