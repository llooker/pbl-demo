'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    console.log('customizeController main')
    // const { email } = req.session.userProfile
    // let defaultCustomizationObj = {
    //     companyname: 'WYSIWYG'
    // }
    // Customization.find({ username: email }).exec((err, customization) => {
    //     console.log('customization', customization)
    //     if (err) {
    //         console.log('err: ' + err);
    //     } else {
    //         if (customization === undefined || customization.length === 0) {
    //             // array empty or does not exist
    //             // create customization for user if first time
    //             Customization.create(
    //                 {
    //                     username: email,
    //                     customizations: [defaultCustomizationObj]
    //                 },
    //                 (err, initializedCustomization) => {
    //                     console.log('initializedCustomization', initializedCustomization)
    //                     if (err) {
    //                         console.log('err: ' + err);
    //                         res.send('error');
    //                     } else {
    //                         console.log('customization initialized');
    //                         // res.session.activeCustomization = initializedCustomization.customizations[0]
    //                         res.status(200).send([initializedCustomization]); //need to send back array
    //                     }
    //                 }
    //             );
    //         } else {
    //             // res.session.activeCustomization = customization.customizations[0]
    //             res.status(200).send(customization);
    //         }
    //     }
    // })
}

module.exports.saveCustomization = (req, res, next) => {
    console.log('customizeController saveCustomization')
    const { email } = req.session.userProfile
    const customizationToSave = req.body
    customizationToSave.id = makeid(16)
    Customization.findOneAndUpdate(
        { username: email },
        { $push: { customizations: customizationToSave } },
        { new: true },
        (err, documents) => {
            // res.send({ error: err, affected: documents });
            if (err) {
                console.log('error: ' + err);
                res.status(400);
            } else {
                res.status(200).send(documents);
            }
        }
    );

}

module.exports.deleteCustomization = (req, res, next) => {
    console.log('customizeController deleteCustomization')
    const { email } = req.session.userProfile
    const { customizationId } = req.body

    Customization.findOneAndUpdate(
        { username: email },
        { '$pull': { "customizations": { id: customizationId } } },
        { new: true },
        (err, documents) => {
            // res.send({ error: err, affected: documents });
            if (err) {
                console.log('error: ' + err);
                res.status(400);
            } else {
                res.status(200).send(documents);
            }
        }
    );
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

console.log(makeid(5));