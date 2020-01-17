'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    console.log('customizeController saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    const customizationToSave = req.body
    customizations.splice(customizationToSave.index, 1, customizationToSave)
    if (customizationToSave.id) {
        //existing customization
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
    } else {
        //brand new customization
        customizationToSave.id = makeid(16)
        customizationToSave.index = req.session.customizations.length
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
            if (err) {
                console.log('error: ' + err);
                res.status(400);
            } else {
                res.status(200).send(documents);
            }
        }
    );
}

// module.exports.editCustomization = (req, res, next) => {
//     console.log('customizeController editCustomization')
//     const { email } = req.session.userProfile
//     const { customizationId } = req.body
//     console.log('email', email)
//     console.log('customizationId', customizationId)



//     Customization
//         // .find({ username: email }, { 'customizations.id': `${customizationId}` })
//         .findOne({ username: email })
//         .exec(function (err, documents) {
//             if (err) {
//                 console.log('error: ' + err);
//                 res.status(400);
//             } else {
//                 // console.log('data: ' + data);
//                 res.status(200).send(documents);
//             }
//         })
// }

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