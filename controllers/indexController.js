'use strict'

const { LookerNodeSDK } = require('@looker/sdk')
const config = require('../config');
const user = require('../demoUser.json');

var crypto = require('crypto');
var querystring = require('querystring');

const Customization = require('../models/Customization');
var { createSignedUrl, accessToken } = require('../server_utils/auth_utils')



// keep for sdk example for now
// module.exports.main = async (req, res, next) => {
//     console.log('indexController main');
//     console.log('req.session', req.session)

// const sdk = LookerNodeSDK.createClient() //valid client :D

//     // for testing purposes
//     // const me = await sdk.ok(sdk.me(
//     //     "id, first_name, last_name, display_name, email, personal_space_id, home_space_id, group_ids, role_ids"))
//     // // console.log({ me }) //working :D

//     //api calls
//     // const looks = await sdk.ok(sdk.all_looks())
//     // const dashboards = await sdk.ok(sdk.all_dashboards())
//     // const session = await sdk.ok(sdk.session())

//     var embed_url = await sample(req.session);
//     console.log('embed_url', embed_url)
//     let resObj = { embed_url }

//     res.send(resObj)
// }


module.exports.fetchFolder = async (req, res, next) => {
    // console.log('indexController fetchFolder');

    const { params } = req
    const sdk = LookerNodeSDK.createClient() //valid client :D
    const folder = await sdk.ok(sdk.folder(params.folder_id))
    let resObj = { folder }

    res.send(resObj)
}

module.exports.retrieveDashboardFilters = async (req, res, next) => {
    // console.log('indexController retrieveDashboardFilters');

    const { params } = req
    const sdk = LookerNodeSDK.createClient() //valid client :D

    const queryObject = {
        "model": "thelook_adwords",
        "view": "events", //view = explore
        "fields": ["users.gender",
            // "user_session_fact.site_acquisition_source",
            // "session_attribution.purchase_session_traffic_source",
            // "sessions.traffic_source"
        ],
        "filters": {},
        "sorts": [],
        "limit": "500",
        "query_timezone": "America/Los_Angeles"
    }


    let query = await sdk.ok(sdk.run_inline_query({ body: queryObject, result_format: 'json' }))
    let resObj = { query }

    res.send(resObj)
}

function nonce(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


module.exports.readSession = async (req, res, next) => {
    let session = req.session //get session

    if (session.userProfile) session = await checkForCustomizations(session)

    res.status(200).send({ session }) //send whole session back
}


module.exports.writeSession = async (req, res, next) => {
    let session = req.session
    session.userProfile = req.body
    session = await checkForCustomizations(session)
    res.status(200).send({ session });
}

async function checkForCustomizations(session) {
    // console.log('checkForCustomizations')
    const { email } = session.userProfile

    let defaultCustomizationObj = {
        id: 'defaultCustomization',
        companyname: 'WYSIWYG',
        date: new Date() //save date with default customization
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
                                    // console.log('initializedCustomization', initializedCustomization)
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


//function createSignedUrl(src, user, host, secret, nonce) {
module.exports.auth = (req, res, next) => {
    // console.log('indexController authh');
    // Authenticate the request is from a valid user here
    const src = req.query.src;
    const url = createSignedUrl(src, user, config.looker.host, config.looker.embed_secret);
    res.json({ url });
}
