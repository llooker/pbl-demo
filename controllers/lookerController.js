'use strict'

const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const sdk31 = new Looker31SDK(session)

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

module.exports.createQuery = async (req, res, next) => {
    // console.log('indexController createQuery');
    //feedback from fabio 4/29
    //two calls, could you make 1 via runinlinequery
    //json level detail to get field definitions
    const { params } = req
    try {
        let create_query_response = await sdk.ok(sdk.create_query(params.query_body, ''));
        let query_response = await sdk.ok(sdk.run_query({ query_id: create_query_response.id, result_format: params.result_format }))
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