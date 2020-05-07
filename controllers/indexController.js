'use strict'

//const lookerHost = process.env.LOOKER_HOST;
const lookerHostNameToUse = process.env.LOOKER_HOST.substr(0, process.env.LOOKER_HOST.indexOf('.')) //lookerHost.substr(0, lookerHost.indexOf('.'));
const Customization = require('../models/Customization');
const { makeid } = require('../tools');



module.exports.readSession = async (req, res, next) => {
    // console.log('readSession')
    let { session } = req
    session.lookerHost = lookerHostNameToUse; //lookerHostNameToUse
    if (session.userProfile) session = await checkForCustomizations(session)
    res.status(200).send({ session })
}

module.exports.writeSession = async (req, res, next) => {
    // console.log('writeSession')
    let { session } = req;
    session.userProfile = req.body.userProfile;
    session.lookerUser = req.body.lookerUser;
    session.lookerHost = lookerHostNameToUse; //lookerHostNameToUse;
    /**/
    session.lookerUser.external_user_id = session.userProfile.googleId;
    session.lookerUser.first_name = session.userProfile.givenName;
    session.lookerUser.last_name = session.userProfile.familyName;
    /**/
    session = await checkForCustomizations(session)
    res.status(200).send({ session });
}

module.exports.endSession = async (req, res, next) => {
    req.session.destroy();
    res.status(200).send('session destroyed :)');
}

async function checkForCustomizations(session) {
    // console.log('checkForCustomizations')
    const { email } = session.userProfile

    let defaultCustomizationObj = {
        // id: 'defaultCustomization',
        id: makeid(16),
        companyName: 'WYSIWYG',
        logoUrl: 'https://looker.com/assets/img/images/logos/looker_black.svg',
        date: new Date()
        // industry: "marketing", 
    }

    var myPromise = () => {
        return new Promise((resolve, reject) => {

            Customization
                .find({ username: email })
                .limit(1)
                .exec(function (err, data) {
                    // console.log('inside exec');
                    if (err) {
                        // console.log('err: ' + err);
                        reject(err)
                    } else {
                        // console.log('data: ' + data);
                        // console.log('data[0]: ' + data[0]);

                        //three options
                        //user doesn't exist
                        //user exists but no customization for looker host
                        //user exists && customization exists


                        if (data[0] === undefined || data.length === 0) {
                            // array empty or does not exist
                            // create customization for user if first time
                            // console.log('inside ifff')
                            Customization.create(
                                {
                                    username: email,
                                    ['customizations.' + `${lookerHostNameToUse}`]: [defaultCustomizationObj]
                                },
                                (err, initializedCustomization) => {
                                    if (err) {
                                        // console.log('err: ' + err);
                                        reject(err)
                                    } else {
                                        // console.log('customization initialized');
                                        resolve(initializedCustomization.customizations[lookerHostNameToUse])
                                    }
                                }
                            );
                        } else if (!data[0].customizations[lookerHostNameToUse]) {
                            // console.log('inside else ifff')
                            Customization.findOneAndUpdate(
                                { username: email },
                                { $push: { ['customizations.' + `${lookerHostNameToUse}`]: defaultCustomizationObj } }, //push to end of array
                                { new: true },
                                (err, documents) => {
                                    if (err) {
                                        // console.log('err: ' + err);
                                        // res.status(400);
                                    } else {
                                        resolve(documents.customizations[lookerHostNameToUse]);

                                    }
                                }
                            );

                        }
                        else {
                            // console.log('inside elllse')
                            resolve(data[0].customizations[lookerHostNameToUse])
                        }
                    }
                });
        });
    };

    var result = await myPromise();
    session.customizations = result
    return session;
}