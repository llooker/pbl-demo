'use strict';
const Customization = require('../models/Customization');

module.exports.main = (req, res, next) => {
    console.log('customizeController main')
}

module.exports.saveCustomization = (req, res, next) => {
    console.log('customizeController saveCustomization')
    const { email } = req.session.userProfile
    const { customizations } = req.session
    console.log('req.body', req.body)
    const customizationToSave = req.body
    const { customizationIndex } = req.body
    delete customizationToSave.customizationIndex
    console.log('customizationToSave', customizationToSave)
    console.log('customizationIndex', customizationIndex)
    //existing customization
    if (customizationToSave.id) {
        console.log('inside ifff')
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
    } else { //brand new customization
        console.log('inside ellse')
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
                    res.status(200).send(documents);
                }
            }
        );
    }

}

module.exports.deleteCustomization = (req, res, next) => {
    console.log('customizeController deleteCustomization')
    const { email } = req.session.userProfile
    // const { customizationId } = req.body
    const { customizationIndex } = req.body
    const { customizations } = req.session

    customizations.splice(customizationIndex)
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

    // old deletion logic
    // Customization.findOneAndUpdate(
    //     { username: email },
    //     { '$pull': { "customizations": { id: customizationId } } },
    //     { new: true },
    //     (err, documents) => {
    //         if (err) {
    //             console.log('error: ' + err);
    //             res.status(400);
    //         } else {
    //             res.status(200).send(documents);
    //         }
    //     }
    // );
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