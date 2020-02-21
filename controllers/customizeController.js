'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    // console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    // console.log('customizeController saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const customizationToSave = req.body
    customizationToSave.date = new Date() //add date to customization
    const { customizationIndex } = req.body
    delete customizationToSave.customizationIndex // we don't want to save index here
    //existing customization
    if (customizationToSave.id) {
        //update index of desired customization
        customizations.splice(customizationIndex, 1, customizationToSave)
        Customization.findOneAndUpdate(
            { username: email },
            { $set: { customizations: customizations } },
            { new: true },
            (err, documents) => {
                if (err) {
                    console.log('error: ' + err);
                    res.status(400);
                } else {
                    req.session.customizations = documents.customizations
                    res.status(200).send(documents);
                }
            }
        );
    } else { //brand new customization
        customizationToSave.id = makeid(16)
        Customization.findOneAndUpdate(
            { username: email },
            { $push: { customizations: customizationToSave } }, //push to end of array
            { new: true },
            (err, documents) => {
                if (err) {
                    console.log('error: ' + err);
                    res.status(400);
                } else {
                    req.session.customizations = documents.customizations
                    res.status(200).send(documents);
                }
            }
        );
    }
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

module.exports.saveLookerContent = (req, res, next) => {
    // console.log('customizeController saveLookerContent')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const { activeCustomization } = req.body
    const { newLookerContent } = req.body

    //indexOfCustomizationToEdit
    var customizationIndex;
    customizations.some((item, index) => {
        if (item.id === activeCustomization.id) {
            customizationIndex = index;
            return true;
        }
    });

    let customizationToSave = customizations[customizationIndex]
    if (customizationToSave.lookerContent) {
        customizationToSave.lookerContent.push(newLookerContent)
    } else {
        customizationToSave.lookerContent = [newLookerContent]
    }

    if (activeCustomization.id) { //not sure about this iff for now
        //update index of desired customization
        customizations.splice(customizationIndex, 1, customizationToSave)
        Customization.findOneAndUpdate(
            { username: email },
            { $set: { customizations: customizations } },
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