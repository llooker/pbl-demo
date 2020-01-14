'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    console.log('customizeController main')
    const { email } = req.session.userProfile
    Customization.find({ username: email }).exec((err, customization) => {
        if (err) {
            console.log('err: ' + err);
        } else {
            console.log('customization', customization)
            if (customization === undefined || customization.length == 0) {
                // array empty or does not exist
                console.log('inside ifff')
                Customization.create(
                    {
                        username: email
                    },
                    (err, customization) => {
                        if (err) {
                            console.log('err: ' + err);
                        } else {
                            res.status(200).send(customization);
                        }
                    }
                );
            } else {
                console.log('else')
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