'use strict'

const express = require('express');
const router = express.Router();

const indexCtrl = require('../controllers/indexController');
const lookerCtrl = require('../controllers/lookerController');

//session mgmt
router.get('/readsession', indexCtrl.readSession);
router.post('/writesession', indexCtrl.writeSession);
router.post('/endsession', indexCtrl.endSession);
router.get('/refreshlookertoken', indexCtrl.refreshLookerToken);

//looker mgmt
router.get('/auth', lookerCtrl.auth);
router.post('/updatelookeruser', lookerCtrl.updateLookerUser);
router.post('/createcase', indexCtrl.createCase);

module.exports = router;