'use strict'

// const { LookerNodeSDK } = require('@looker/sdk')
// const sdk = LookerNodeSDK.init31() //valid client :D //.createClient()
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const sdk31 = new Looker31SDK(session)

const lookerHostNameToUse = process.env.LOOKER_HOST.substr(0, process.env.LOOKER_HOST.indexOf('.')) //lookerHost.substr(0, lookerHost.indexOf('.'));
const Customization = require('../models/Customization');
const { makeid } = require('../tools');



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

    const userCred = await sdk.ok(sdk.user_for_credential('embed', req.session.lookerUser.external_user_id))
    const embedUser = await sdk.ok(sdk.user(userCred.id));

    // const folderListAsString = `${params.folder_id},${embedUser.personal_folder_id}`;
    // console.log('folderListAsString', folderListAsString)
    // const looks = await sdk.ok(sdk.search_looks({ space_id: folderListAsString }))
    // console.log('looks', looks)
    // let resObj = { looks }


    const sharedFolder = await sdk.ok(sdk.folder(params.folder_id))
    const embeddedUserFolder = await sdk.ok(sdk.folder(embedUser.personal_folder_id))
    let resObj = {
        sharedFolder,
        embeddedUserFolder
    }

    res.send(resObj)
}

module.exports.retrieveDashboardFilters = async (req, res, next) => {
    // console.log('indexController retrieveDashboardFilters');

    const { params } = req

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
    // console.log('readSession')
    let { session } = req //get session
    // console.log('000 session', session)
    // console.log('000 session.id', session.id)
    session.lookerHost = lookerHostNameToUse

    if (session.userProfile) session = await checkForCustomizations(session)
    // console.log('111 session', session)

    res.status(200).send({ session }) //send whole session back
}


module.exports.writeSession = async (req, res, next) => {
    // console.log('writeSession')
    let { session } = req;
    session.userProfile = req.body.userProfile;
    session.lookerUser = req.body.lookerUser;
    session.lookerHost = lookerHostNameToUse;
    /**/
    session.lookerUser.external_user_id = session.userProfile.googleId;
    session.lookerUser.first_name = session.userProfile.givenName;
    session.lookerUser.last_name = session.userProfile.familyName;
    /**/
    session = await checkForCustomizations(session)
    res.status(200).send({ session });
}



module.exports.endSession = async (req, res, next) => {
    // console.log('endSession')

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


//function createSignedUrl(src, user, host, secret, nonce) {
module.exports.auth = (req, res, next) => {
    // console.log('indexController authh');
    // console.log('user', user)
    // console.log('req.session.lookerUser', req.session.lookerUser);
    // Authenticate the request is from a valid user here
    const src = req.query.src;
    const url = createSignedUrl(src, req.session.lookerUser, process.env.LOOKER_HOST, process.env.LOOKERSDK_EMBED_SECRET);
    // console.log('url', url)
    res.json({ url });
}



module.exports.performApiCall = async (req, res, next) => {
    // console.log('indexController performApiCall');

    const { params } = req
    // console.log('params', params)
    // console.log('params.type', params.type)
    // console.log('params.type === "dashboard"', params.type === "dashboard")
    // console.log('params.type === "look"', params.type === "look")
    let returnVal;
    if (params.type === 'dashboard') {
        returnVal = await sdk.ok(sdk.all_dashboards())
    } else if (params.type === 'look') {
        returnVal = await sdk.ok(sdk.all_looks())
    }
    // console.log('returnVal', returnVal)
    let resObj = { returnVal }

    res.send({ resObj })
}

module.exports.validateLookerContent = async (req, res, next) => {
    // console.log('indexController validateLookerContent');

    const contentId = req.params.content_id;
    const contentType = req.params.content_type;

    let returnVal;

    try {
        returnVal = await sdk.ok(sdk[contentType](contentId))
        res.status(200).send(returnVal)
    } catch (err) {
        // returnVal = err
        let errorObj = {
            errorMessage: 'Invalid id!'
        }
        res.status(404).send(errorObj)
    }
}


module.exports.updateLookerUser = (req, res, next) => {
    // console.log('updateLookerUser')
    // console.log('req.body', req.body)
    const lookerUser = req.body
    // console.log('lookerUser', lookerUser)
    let { session } = req
    // console.log('session', session)
    session.lookerUser = lookerUser;
    // console.log('111 session', session)
    res.status(200).send({ session });
}

module.exports.fetchDashboard = async (req, res, next) => {
    // console.log('indexController fetchDashboard');

    const { params } = req
    console.log('params', params)
    const dashboard = await sdk.ok(sdk.dashboard(params.dashboard_id));
    sdk.da

    let resObj = {
        dashboard
    }

    res.send(resObj)
}

module.exports.runQuery = async (req, res, next) => {
    // console.log('indexController runQuery');

    const { params } = req
    // console.log('params', params)


    try {
        // console.log(sdk.run_query.toString())
        let query = await sdk.ok(sdk.run_query({ query_id: params.query_id, result_format: params.result_format }))
        // console.log('000 query', query)
        // query.id = params.query_id
        // console.log('111 query', query)
        let resObj = {
            queryId: params.query_id,
            queryResults: query
        }
        res.status(200).send(resObj)
    } catch (err) {
        console.log('catch')
        console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj)
    }
}

module.exports.runInlineQuery = async (req, res, next) => {
    // console.log('indexController runInlineQuery');

    const { params } = req
    // console.log('params', params)

    try {
        let query_response = await sdk.ok(sdk.run_inline_query({ result_format: params.result_format, body: params.inline_query }));

        let resObj = {
            queryResults: query_response
        }
        res.status(200).send(resObj)
    } catch (err) {
        console.log('catch')
        console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj)
    }
}
