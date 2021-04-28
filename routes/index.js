'use strict'

const express = require('express');
const router = express.Router();

const indexCtrl = require('../controllers/indexController');
const lookerCtrl = require('../controllers/lookerController');
const cloudFunctionCtrl = require('../controllers/cloudFunctionsController');
const cloudStorageCtrl = require('../controllers/cloudStorageController');

//session mgmt
router.get('/readsession', indexCtrl.readSession);
router.post('/writesession', indexCtrl.writeSession);
router.post('/endsession', indexCtrl.endSession);
router.get('/refreshlookertoken', indexCtrl.refreshLookerToken);

//looker mgmt
router.get('/auth', lookerCtrl.auth);
router.post('/updatelookeruser', lookerCtrl.updateLookerUser);

//cloud fnction  mgmt
router.post('/createcase', cloudFunctionCtrl.createCase);
router.post('/addcasenotes', cloudFunctionCtrl.addCaseNotes);
router.post('/changecasestatus', cloudFunctionCtrl.changeCaseStatus);
router.post('/signedcloudstorageurl', cloudStorageCtrl.generateV4ReadSignedUrl);

module.exports = router;