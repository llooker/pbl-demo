'use strict'

const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const rp = require('request-promise');

module.exports.auth = async (req, res, next) => {
  // console.log('lookerController auth');
  // Authenticate the request is from a valid user here
  const src = req.query.src;
  // console.log('src', src)
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
  const { params } = req;
  try {
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
      let look = await sdk.ok(sdk.look(embeddedUserFolder.looks[i].id));
      let clientId = look.query.client_id;
      embeddedUserFolder.looks[i].client_id = clientId;
    }

    let codeAsString = this.fetchFolder.toString();
    let resObj = {
      sharedFolder,
      embeddedUserFolder,
      code: codeAsString
    }
    res.status(200).send(resObj)
  } catch (err) {
    let errorObj = {
      errorMessage: 'Not working!'
    }
    res.status(400).send(errorObj);
  }
}

module.exports.updateLookerUser = (req, res, next) => {
  const lookerUser = req.body;
  let { session } = req;
  session.lookerUser = lookerUser;
  res.status(200).send({ session });
}

//at a glance cards
module.exports.runQuery = async (req, res, next) => {
  const { params } = req;
  try {
    let query = await sdk.ok(sdk.run_query({ query_id: params.query_id, result_format: params.result_format }));
    let resObj = {
      queryId: params.query_id,
      queryResults: query
    }
    res.status(200).send(resObj);
  } catch (err) {
    let errorObj = {
      errorMessage: 'Not working!'
    }
    res.status(400).send(errorObj)
  }
}

module.exports.runInlineQuery = async (req, res, next) => {
  // console.log('runInlineQuery');
  const { params } = req;
  // console.log('params', params);
  // var start = new Date().getTime();
  try {
    let codeAsString = this.runInlineQuery.toString();
    let embeddedUserSdkSession = await createEmbeddedUserSdkSession(req);
    let query_response = await embeddedUserSdkSession.ok(embeddedUserSdkSession.run_inline_query({ result_format: params.result_format || 'json', body: params.inline_query, apply_formatting: false }));
    // console.log('query_response', query_response)
    // var end = new Date().getTime();
    // var time = end - start;
    // console.log('execution time ', time)
    // console.log('query_response', query_response)

    let resObj = {
      queryResults: query_response,
      code: codeAsString
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
    let codeAsString = this.createQueryTask.toString();
    let embeddedUserSdkSession = await createEmbeddedUserSdkSession(req);
    let create_query_response = await embeddedUserSdkSession.ok(embeddedUserSdkSession.create_query(params.query_body, ''));
    let query_task = await embeddedUserSdkSession.ok(embeddedUserSdkSession.create_query_task({
      body: {
        query_id: create_query_response.id,
        result_format: params.result_format,
      }
    }));
    // console.log('query_task', query_task)
    let resObj = {
      queryTaskId: query_task.id,
      code: codeAsString
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
  // console.log('params', params)

  try {
    let codeAsString = this.createQueryTask.toString();
    let embeddedUserSdkSession = await createEmbeddedUserSdkSession(req);
    let async_query_results = await embeddedUserSdkSession.ok(embeddedUserSdkSession.query_task_results(params.task_id));
    let resObj = {
      queryResults: async_query_results,
      code: codeAsString
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
  // console.log('lookerController deleteLook');
  const { params } = req;
  // console.log('params', params)

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

module.exports.getLook = async (req, res, next) => {
  // console.log('lookerController getLook');
  const { params } = req;
  // console.log('params', params)

  try {
    let look = await sdk.ok(sdk.get_look(params.look_id));
    console.log('look', look)
    let resObj = {
      message: look
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

module.exports.getThumbnail = async (req, res, next) => {
  const { params } = req;
  try {
    let codeAsString = this.getThumbnail.toString();
    let thumbnail = await sdk.ok(sdk.get(`/vector_thumbnail/${params.type}/${params.id}`));
    let resObj = {
      svg: thumbnail,
      code: codeAsString
    };
    res.status(200).send(resObj);

  } catch (err) {
    let errorObj = {
      errorMessage: 'Not working!'
    }
    res.status(400).send(errorObj);
  }
}

async function createEmbeddedUserSdkSession(req) {
  const src = req.query.src;
  const lookerUser = req.session.lookerUser;
  const url = await createSignedUrl(src, lookerUser, process.env.LOOKER_HOST, process.env.LOOKERSDK_EMBED_SECRET);
  await rp(url)
  //get user id of embedded user
  const userCred = await sdk.ok(sdk.user_for_credential('embed', req.session.lookerUser.external_user_id));
  //create separate session for embedded user
  const embeddedUserSession = new NodeSession(settings)
  //instantiate new sdk client based on embedded session
  const embeddedUserSdk = new Looker40SDK(embeddedUserSession)
  //ensure service account connected before sudoing
  await embeddedUserSdk.ok(embeddedUserSdk.me())
  //sudo as embedded user
  await embeddedUserSdk.authSession.login(userCred.id.toString())
  return embeddedUserSdk
}
