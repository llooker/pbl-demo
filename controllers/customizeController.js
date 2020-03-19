'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    // console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    // console.log('saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const customizationToSave = req.body
    customizationToSave.date = new Date() //add date to customization, server side all that matters
    const { customizationIndex } = req.body
    req.session.activeCustomization = customizationIndex;
    delete customizationToSave.customizationIndex // we don't want to save index here



    //existing customization
    if (customizationToSave.id) {
        //need to account for looker content
        if (customizations[customizationIndex].lookerContent) {
            customizationToSave.lookerContent = customizations[customizationIndex].lookerContent
        }
        //update index of desired customization
        customizations.splice(customizationIndex, 1, customizationToSave) //customizationToSave
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
                    // res.status(200).send(documents);
                    res.status(200).send(req.session);
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
                    // res.status(200).send(documents);
                    res.status(200).send(req.session);
                }
            }
        );
    }
}


module.exports.updateActiveCustomization = (req, res, next) => {
    console.log('updateActiveCustomization')
    console.log('req.body', req.body)
    const { customizationIndex } = req.body
    req.session.activeCustomization = customizationIndex;
    let { session } = req
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

module.exports.saveLookerContent = async (req, res, next) => {
    // console.log('customizeController saveLookerContent')
    // propsed solution:
    // fetch customizations from db before saving to ensure up to date
    let { session } = req
    session = await checkForCustomizations(session)

    const { email } = req.session.userProfile
    const { customizations } = req.session
    const { activeCustomization } = req.body
    const { newLookerContent } = req.body

    //customizationIndex
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


async function checkForCustomizations(session) {
    // console.log('checkForCustomizations')
    const { email } = session.userProfile

    let defaultCustomizationObj = {
        id: 'defaultCustomization',
        companyName: 'WYSIWYG',
        logoUrl: 'https://looker.com/assets/img/images/logos/looker_black.svg',
        date: new Date(),
        industry: "marketing"
    }

    var myPromise = () => {
        return new Promise((resolve, reject) => {

            Customization
                .find({ username: email })
                .limit(1)
                .exec(function (err, data) {
                    if (err) {
                        // console.log('err: ' + err);
                        reject(err)
                    } else {
                        if (data[0] === undefined || data.length === 0) {
                            // array empty or does not exist
                            // create customization for user if first time
                            Customization.create(
                                {
                                    username: email,
                                    customizations: [defaultCustomizationObj]
                                },
                                (err, initializedCustomization) => {
                                    if (err) {
                                        // console.log('err: ' + err);
                                        reject(err)
                                    } else {
                                        // console.log('customization initialized');
                                        resolve(initializedCustomization.customizations)
                                    }
                                }
                            );
                        } else {
                            resolve(data[0].customizations)
                        }
                    }
                });
        });
    };

    var result = await myPromise();
    session.customizations = result
    return session;
}