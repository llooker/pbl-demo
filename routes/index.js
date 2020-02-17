'use strict'

const express = require('express')
const router = express.Router();

const indexCtrl = require('../controllers/indexController')
const customizeCtrl = require('../controllers/customizeController')

router.get('/fetchfolder/:folder_id', indexCtrl.fetchFolder)
router.get('/readsession', indexCtrl.readSession)
router.post('/writesession', indexCtrl.writeSession)
router.get('/retievedashboardfilters/:content_id', indexCtrl.retrieveDashboardFilters)

router.get('/customize', customizeCtrl.main)
router.post('/savecustomization', customizeCtrl.saveCustomization)

//for embed sdk
router.get('/auth', indexCtrl.auth)


router.get('/performapicall/:type', indexCtrl.performApiCall)

module.exports = router