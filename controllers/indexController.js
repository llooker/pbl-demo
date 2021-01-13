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
  session.packageName = process.env.PACKAGE_NAME
  res.status(200).send({ session })
}

module.exports.writeSession = async (req, res, next) => {
  let { session } = req;
  session.userProfile = req.body.userProfile;
  session.lookerUser = req.body.lookerUser;
  session.lookerHost = process.env.LOOKER_HOST;
  session.lookerBaseUrl = process.env.LOOKERSDK_BASE_URL;
  session.lookerUser.external_user_id = session.userProfile.email;
  session.lookerUser.first_name = session.userProfile.givenName;
  session.lookerUser.last_name = session.userProfile.familyName;
  session.lookerApiToken = await tokenHelper(session);
  session.packageName = process.env.PACKAGE_NAME;

  res.status(200).send({ session: session });
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
  // Calling the iframe url to ensure the embed user exists
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
    expires_in: (Date.now() + (embed_user_token.value.expires_in * 900)) //+ 5000)s
  }
  return { ...u }

}