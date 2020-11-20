'use strict'
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const rp = require('request-promise');

module.exports.auth = async (req, res, next) => {
  // console.log('lookerController auth');
  const src = req.query.src;
  // console.log({src})
  const url = createSignedUrl(src,
    req.session.lookerUser,
    process.env.LOOKER_HOST,
    process.env.LOOKERSDK_EMBED_SECRET);
  // console.log({ url })
  res.status(200).json({ url });
}

module.exports.updateLookerUser = async (req, res, next) => {
  const lookerUser = req.body;
  let { session } = req;
  const url = createSignedUrl('/alive',
    lookerUser, process.env.LOOKER_HOST,
    process.env.LOOKERSDK_EMBED_SECRET);
  await rp(url)
  session.lookerUser = lookerUser;
  res.status(200).send({ session });
}