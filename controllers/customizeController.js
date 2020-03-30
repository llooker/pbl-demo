'use strict';
const Customization = require('../models/Customization');
const config = require('../config');
const lookerHostNameToUse = config.looker.host.substr(0, config.looker.host.indexOf('.')); //is this right

module.exports.main = (req, res, next) => {
    // console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    // console.log('saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const customizationToSave = req.body
    customizationToSave.date = new Date() //add date to customization, server side all that matters
    // customizationToSave.lookerHost = config.looker.host;
    const { customizationIndex } = req.body
    delete customizationToSave.customizationIndex // we don't want to save index here

    // console.log('000 customizationToSave', customizationToSave)



    //existing customization
    if (customizationToSave.id) {
        // console.log('inside ifff')
        //need to account for looker content
        if (customizations[customizationIndex].lookerContent) {
            customizationToSave.lookerContent = customizations[customizationIndex].lookerContent
        }

        //update index of desired customization
        customizations.splice(customizationIndex, 1, customizationToSave) //customizationToSave
        Customization.findOneAndUpdate(
            { username: email },
            // { $set: { customizations: customizations } },
            { $set: { ['customizations.' + `${lookerHostNameToUse}`]: customizations } },
            { new: true },
            (err, documents) => {
                if (err) {
                    console.log('err: ' + err);
                    res.status(400);
                } else {
                    console.log('documents: ' + documents);
                    req.session.customizations = documents.customizations[lookerHostNameToUse]
                    res.status(200).send(req.session);
                }
            }
        );
    } else { //brand new customization
        // console.log('inside elsse')
        customizationToSave.id = makeid(16)
        // console.log('1111 customizationToSave', customizationToSave)
        Customization.findOneAndUpdate(
            { username: email },
            // { $push: { customizations: customizationToSave } }, //push to end of array
            { $push: { ['customizations.' + `${lookerHostNameToUse}`]: customizationToSave } }, //push to end of array
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

    if (activeCustomization.id) { //not sure about this iff for now
        //update index of desired customization
        // console.log('inside ifff')
        customizations.splice(customizationIndex, 1, customizationToSave)
        console.log('customizations', customizations)
        Customization.findOneAndUpdate(
            { username: email },
            // { $set: { customizations: customizations } },
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
    } else {
        console.log('inside ellse')
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


//helper function
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}