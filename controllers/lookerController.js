'use strict'
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const rp = require('request-promise');

module.exports.auth = async (req, res, next) => {
  // console.log('lookerController auth');
  const src = req.query.src;
  const { lookerUser } = req.session
  const url = createSignedUrl(src,
    lookerUser,
    process.env.LOOKER_HOST,
    process.env.LOOKERSDK_EMBED_SECRET);
  res.status(200).json({ url });
}

module.exports.updateLookerUser = async (req, res, next) => {
  // console.log('lookerController updateLookerUser');
  const lookerUser = req.body;
  let { session } = req;
  session.lookerUser = lookerUser;
  const url = createSignedUrl('/alive',
    session.lookerUser,
    process.env.LOOKER_HOST,
    process.env.LOOKERSDK_EMBED_SECRET);
  await rp(url)
  res.status(200).send({ session });
}