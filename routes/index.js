'use strict'

const express = require('express');
const router = express.Router();

const indexCtrl = require('../controllers/indexController');
const lookerCtrl = require('../controllers/lookerController');
const cloudServicesCtrl = require('../controllers/cloudServicesController');

//session mgmt
router.get('/readsession', indexCtrl.readSession);
router.post('/writesession', indexCtrl.writeSession);
router.post('/endsession', indexCtrl.endSession);
router.get('/refreshlookertoken', indexCtrl.refreshLookerToken);

//looker mgmt
router.get('/auth', lookerCtrl.auth);
router.post('/updatelookeruser', lookerCtrl.updateLookerUser);

//cloud services  mgmt
router.post('/createcase', cloudServicesCtrl.createCase);
router.post('/addcasenotes', cloudServicesCtrl.addCaseNotes);
router.post('/changecasestatus', cloudServicesCtrl.changeCaseStatus);
router.post('/signedcloudstorageurl', cloudServicesCtrl.generateV4ReadSignedUrl);

module.exports = router;