'use strict'
const { createSignedUrl } = require('../server_utils/auth_utils')
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const settings = new NodeSettingsIniFile()
const sdkSession = new NodeSession(settings)
const sdk = new Looker40SDK(sdkSession)
const rp = require('request-promise');

module.exports.readSession = async (req, res, next) => {
  // console.log("readSession")
  let { session } = req
  // console.log({ session })
  // session.packageName = process.env.PACKAGE_NAME
  res.status(200).send({ session })
}

module.exports.writeSession = async (req, res, next) => {
  // console.log("writeSession")
  let { session } = req;
  let { userProfile } = req.body;
  //apply environment variables to session
  session.lookerHost = process.env.LOOKER_HOST;
  session.lookerBaseUrl = process.env.LOOKERSDK_BASE_URL;
  session.packageName = process.env.PACKAGE_NAME;
  session.cloudFunctionSecret = process.env.CLOUD_FUNCTION_SECRET;

  //userProfile from google auth
  session.userProfile = userProfile;
  //initial lookerUser obj + properties from google auth
  let lookerUser = {
    ...req.body.lookerUser,
    external_user_id: userProfile.email,
    first_name: userProfile.givenName,
    last_name: userProfile.familyName
  }
  session.lookerUser = lookerUser;
  // this is going to call createSignedUrl via tokenHelper
  if (session.lookerUser.external_user_id) {
    let lookerApiToken = await tokenHelper(session);
    session.lookerApiToken = lookerApiToken;
    res.status(200).send({ message: "succces", session });
  } else {
    res.status(307).send({ message: 'could not set external_user_id, redirect to sign in' })
  }
}

module.exports.endSession = async (req, res, next) => {
  req.session.destroy();
  res.status(200).send({ message: 'session destroyed :)' });
}

module.exports.refreshLookerToken = async (req, res, next) => {
  // console.log('refreshLookerToken')
  let { session } = req;
  session.lookerApiToken = await tokenHelper(session)
  res.status(200).send({ session: session });
}

async function tokenHelper(session) {
  // console.log("tokenHelper")
  // Calling the iframe url to ensure the embed user exists
  // console.log('session.lookerUser', session.lookerUser)
  const url = await createSignedUrl('/alive', session.lookerUser, process.env.LOOKER_HOST, process.env.LOOKERSDK_EMBED_SECRET);
  await rp(url)
  // Initialize the API session, sudo and retrieve the bearer token
  const userCred = await sdk.ok(sdk.user_for_credential('embed', session.userProfile.email));
  const embeddedUserSession = new NodeSession(settings) // node wrapper
  // instantiate new sdk client based on embedded session
  const embeddedUserSdk = new Looker40SDK(embeddedUserSession)
  // ensure service account connected before sudoing
  const me = await embeddedUserSdk.ok(embeddedUserSdk.me())
  const embed_user_token = await embeddedUserSdk.login_user(userCred.id.toString())
  const u = {
    api_user_token: embed_user_token.value,
    expires_in: (Date.now() + (embed_user_token.value.expires_in * 900)) //1000) //
  }
  return { ...u }

}

module.exports.createCase = async (req, res, next) => {
  // console.log("createCase")
  let { session, body } = req;
  console.log({ session })
  console.log({ body })

  let options = {
    method: 'POST',
    // uri: 'https://us-central1-vision-302704.cloudfunctions.net/create_case',
    uri: 'https://us-central1-pbl-demo-2020-281322.cloudfunctions.net/create_case',
    body: {
      "type": "cell",
      "scheduled_plan": null,
      "attachment": null,
      "data": {
        "value": body.applicationId,
        "rendered": body.applicationId,
        "application_id": body.applicationId,
        "security_key": session.cloudFunctionSecret,
        "email": session.userProfile.email
      },
      "form_params": {
        "reason_code": body.caseType
      }
    },
    json: true // Automatically stringifies the body to JSON
  };


  try {
    let postRsp = await rp(options)
    res.status(200).send({
      status: "success",
      message: "Case created! Reload dashboard to see it"
    })
  } catch (err) {
    console.log({ err })
    res.status(400).send({
      status: "error",
      message: err
    })
  }
}