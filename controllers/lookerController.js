'use strict'

const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const sdk31 = new Looker31SDK(session)

module.exports.auth = (req, res, next) => {
    // Authenticate the request is from a valid user here
    const src = req.query.src;
    const url = createSignedUrl(src, req.session.lookerUser, process.env.LOOKER_HOST, process.env.LOOKERSDK_EMBED_SECRET);
    // console.log('url', url)
    res.json({ url });
}

module.exports.validateLookerContent = async (req, res, next) => {
    // console.log('lookerController validateLookerContent');
    const { params } = req;

    let returnVal;
    try {
        returnVal = await sdk.ok(sdk[params.content_type](params.content_id));
        res.status(200).send(returnVal);
    } catch (err) {
        let errorObj = {
            errorMessage: 'Invalid id!'
        }
        res.status(404).send(errorObj);
    }
}

module.exports.fetchFolder = async (req, res, next) => {
    // console.log('lookerController fetchFolder');
    const { params } = req;

    const userCred = await sdk.ok(sdk.user_for_credential('embed', req.session.lookerUser.external_user_id));
    const embedUser = await sdk.ok(sdk.user(userCred.id));
    const sharedFolder = await sdk.ok(sdk.folder(params.folder_id));
    const embeddedUserFolder = await sdk.ok(sdk.folder(embedUser.personal_folder_id));

    for (let h = 0; h < sharedFolder.looks.length; h++) {
        let look = await sdk.ok(sdk.look(sharedFolder.looks[h].id))
        let clientId = look.query.client_id;
        sharedFolder.looks[h].client_id = clientId;
    }

    for (let i = 0; i < embeddedUserFolder.looks.length; i++) {
        // console.log('embeddedUserFolder.looks[i]', embeddedUserFolder.looks[i])
        let look = await sdk.ok(sdk.look(embeddedUserFolder.looks[i].id));
        // console.log('look', look)
        let clientId = look.query.client_id;
        // console.log('embeddedUserFolder clientId', clientId)
        embeddedUserFolder.looks[i].client_id = clientId;
    }


    let resObj = {
        sharedFolder,
        embeddedUserFolder
    }

    res.send(resObj)
}

module.exports.updateLookerUser = (req, res, next) => {
    // console.log('updateLookerUser')
    // console.log('req.body', req.body)
    const lookerUser = req.body;
    let { session } = req;
    session.lookerUser = lookerUser;
    res.status(200).send({ session });
}

//at a glance cards
module.exports.runQuery = async (req, res, next) => {
    // console.log('lookerController runQuery');
    const { params } = req;

    try {
        let query = await sdk.ok(sdk.run_query({ query_id: params.query_id, result_format: params.result_format }));
        let resObj = {
            queryId: params.query_id,
            queryResults: query
        }
        res.status(200).send(resObj);
    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj)
    }
}
//shared url?
module.exports.runInlineQuery = async (req, res, next) => {
    // console.log('lookerController runInlineQuery');
    const { params } = req;
    // console.log('params', params);

    try {
        let query_response = await sdk.ok(sdk.run_inline_query({ result_format: params.result_format, body: params.inline_query }));
        let resObj = {
            queryResults: query_response
        };
        res.status(200).send(resObj);
    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj);
    }
}
//og attempt
module.exports.createQuery = async (req, res, next) => {
    // console.log('lookerController createQuery');
    const { params } = req;
    try {
        let create_query_response = await sdk.ok(sdk.create_query(params.query_body, ''));
        let query_response = await sdk.ok(sdk.run_query({
            query_id: create_query_response.id,
            result_format: params.result_format
        }));
        let resObj = {
            queryResults: query_response
        };
        res.status(200).send(resObj);
    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj);
    }
}

module.exports.createQueryTask = async (req, res, next) => {
    // console.log('lookerController createQueryTask');
    const { params } = req;

    try {
        let create_query_response = await sdk.ok(sdk.create_query(params.query_body, ''));
        let query_task = await sdk.ok(sdk.create_query_task({
            body: {
                query_id: create_query_response.id,
                result_format: params.result_format,
            }
        }));
        let resObj = {
            queryTaskId: query_task.id
        };
        res.status(200).send(resObj);
    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj)
    }
}

module.exports.checkQueryTask = async (req, res, next) => {
    // console.log('lookerController checkQueryTask');
    const { params } = req;

    try {
        let async_query_results = await sdk.ok(sdk.query_task_results(params.task_id));
        let resObj = {
            queryResults: async_query_results
        };
        res.status(200).send(resObj);

    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj);
    }
}

module.exports.deleteLook = async (req, res, next) => {
    console.log('lookerController deleteLook');
    const { params } = req;
    console.log('params', params)

    try {
        let delete_look = await sdk.ok(sdk.delete_look(params.look_id));
        console.log('delete_look', delete_look)
        let resObj = {
            message: delete_look
        };
        res.status(200).send(resObj);

    } catch (err) {
        // console.log('catch')
        // console.log('err', err)
        let errorObj = {
            errorMessage: 'Not working!'
        }
        res.status(404).send(errorObj);
    }
}
