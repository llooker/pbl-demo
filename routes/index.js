'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')
const customizeCtrl = require('../controllers/customizeController')
const lookerCtrl = require('../controllers/lookerController')

//session 
router.get('/readsession', indexCtrl.readSession)
router.post('/writesession', indexCtrl.writeSession)
router.post('/endsession', indexCtrl.endSession)

//customization
router.get('/customize', customizeCtrl.main)
router.post('/savecustomization', customizeCtrl.saveCustomization)
router.post('/savelookercontent', customizeCtrl.saveLookerContent)
router.post('/applyactivecustomziation', customizeCtrl.applyActiveCustomizationToSession)

//looker
router.get('/auth', lookerCtrl.auth)
router.get('/validatelookercontent/:content_id/:content_type', lookerCtrl.validateLookerContent)
router.get('/fetchfolder/:folder_id', lookerCtrl.fetchFolder)
router.get('/fetchdashboard/:dashboard_id', lookerCtrl.fetchDashboard)
router.post('/updatelookeruser', lookerCtrl.updateLookerUser)
router.get('/runquery/:query_id/:result_format', lookerCtrl.runQuery)
router.get('/runinlinequery/:inline_query/:result_format', lookerCtrl.runInlineQuery)
router.get('/createquery/:query_body/:result_format', lookerCtrl.createQuery)

module.exports = router