'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    console.log('customizeController main')
    const { email } = req.session.userProfile
    let defaultCustomizationObj = {
        companyname: 'WYSIWYG'
    }
    Customization.find({ username: email }).exec((err, customization) => {
        console.log('customization', customization)
        if (err) {
            console.log('err: ' + err);
        } else {
            if (customization === undefined || customization.length === 0) {
                // array empty or does not exist
                // create customization for user if first time
                Customization.create(
                    {
                        username: email,
                        customizations: [defaultCustomizationObj]
                    },
                    (err, initializedCustomization) => {
                        console.log('initializedCustomization', initializedCustomization)
                        if (err) {
                            console.log('err: ' + err);
                            res.send('error');
                        } else {
                            console.log('customization initialized');
                            // res.session.activeCustomization = initializedCustomization.customizations[0]
                            res.status(200).send([initializedCustomization]); //need to send back array
                        }
                    }
                );
            } else {
                // res.session.activeCustomization = customization.customizations[0]
                res.status(200).send(customization);
            }
        }
    })
}

module.exports.saveCustomization = (req, res, next) => {
    console.log('customizeController saveCustomization')
    const { email } = req.session.userProfile
    const newCustomization = req.body
    console.log('email', email)
    console.log('newCustomization', newCustomization)
    //embedded document model
    //find customization by email
    //push new custmization to customizations array
    Customization.find({ username: email }).exec((err, customization) => {
        Customization.update(
            { username: email },
            { $push: { customizations: newCustomization } },
            (err, result) => {
                if (err) {
                    console.log('error: ' + err);
                    res.status(400);
                } else {
                    res.status(200).send(result);
                }
            }
        );
    })

}