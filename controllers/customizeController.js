'use strict';
const Customization = require('../models/Customization');
const config = require('../config');
let tools = require('../tools');
const lookerHostNameToUse = config.looker.host.substr(0, config.looker.host.indexOf('.')); //is this right??

module.exports.main = (req, res, next) => {
    // console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    // console.log('saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const customizationToSave = req.body
    customizationToSave.date = new Date()
    // customizationToSave.lookerHost = config.looker.host;
    const { customizationIndex } = req.body

    if (customizationToSave.industry && customizationToSave.industry === 'none') {
        delete customizationToSave.industry
    }

    // console.log('customizationToSave', customizationToSave)


    //existing customization
    if (customizationToSave.id) {
        // console.log('inside ifff')
        // editing at customization level, 
        // need to account for looker content
        if (customizations[customizationIndex].lookerContent) {
            customizationToSave.lookerContent = customizations[customizationIndex].lookerContent
        }

        //update index of desired customization
        customizations.splice(customizationIndex, 1, customizationToSave) //customizationToSave
        Customization.findOneAndUpdate(
            { username: email },
            { $set: { ['customizations.' + `${lookerHostNameToUse}`]: customizations } },
            { new: true },
            (err, documents) => {
                if (err) {
                    console.log('err: ' + err);
                    res.status(400);
                } else {
                    // console.log('documents: ' + documents);
                    req.session.customizations = documents.customizations[lookerHostNameToUse]
                    res.status(200).send(req.session);
                }
            }
        );
    } else { //brand new customization
        // console.log('inside elsse')
        customizationToSave.id = tools.makeid(16); //makeid(16)
        // console.log('1111 customizationToSave', customizationToSave)
        Customization.findOneAndUpdate(
            { username: email },
            { $push: { ['customizations.' + `${lookerHostNameToUse}`]: customizationToSave } },
            { new: true },
            (err, documents) => {
                if (err) {
                    // console.log('err: ' + err);
                    res.status(400);
                } else {
                    // console.log('documents: ' + documents);
                    req.session.customizations = documents.customizations[lookerHostNameToUse]
                    res.status(200).send(req.session);
                }
            }
        );
    }
}


//right now this only works when the customization is defined...
module.exports.saveLookerContent = async (req, res, next) => {
    // console.log('customizeController saveLookerContent')
    // propsed solution:
    // fetch customizations from db before saving to ensure up to date
    let { session } = req
    // session = await checkForCustomizations(session)

    const { email } = req.session.userProfile
    const { customizations } = req.session
    const { activeCustomization } = req.body
    const { newLookerContent } = req.body

    // console.log('customizations', customizations)

    //customizationIndex
    var customizationIndex;
    customizations.some((item, index) => {
        if (item.id === activeCustomization.id) {
            customizationIndex = index;
            return true;
        }
    });

    // console.log('customizationIndex', customizationIndex)

    let customizationToSave = customizations[customizationIndex]
    if (customizationToSave.lookerContent) {
        customizationToSave.lookerContent.push(newLookerContent)
    } else {
        customizationToSave.lookerContent = [newLookerContent]
    }

    if (activeCustomization.id) {
        //update index of desired customization
        // console.log('inside ifff')
        customizations.splice(customizationIndex, 1, customizationToSave)
        Customization.findOneAndUpdate(
            { username: email },
            { $set: { ['customizations.' + `${lookerHostNameToUse}`]: customizations } },
            { new: true },
            (err, documents) => {
                if (err) {
                    console.log('error: ' + err);
                    res.status(400);
                } else {
                    res.status(200).send(documents);
                }
            }
        );
    }
}


module.exports.applyActiveCustomizationToSession = (req, res, next) => {
    // console.log('applyActiveCustomizationToSession')
    // console.log('req.body', req.body)
    const { customizationIndex } = req.body
    // console.log('customizationIndex', customizationIndex)
    let { session } = req
    session.activeCustomization = customizationIndex;
    // console.log('session', session)
    res.status(200).send({ session });
}