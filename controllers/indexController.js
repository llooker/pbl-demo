'use strict'

//const lookerHost = process.env.LOOKER_HOST;
const lookerHostNameToUse = process.env.LOOKER_HOST.substr(0, process.env.LOOKER_HOST.indexOf('.')) //lookerHost.substr(0, lookerHost.indexOf('.'));
const Customization = require('../models/Customization');
const User = require('../models/User');
const { makeid } = require('../tools');

// RG 9/4 adding import for server-side iframe request
const { createSignedUrl, accessToken } = require('../server_utils/auth_utils')
const { Looker40SDK, Looker31SDK, NodeSession, NodeSettingsIniFile } = require('@looker/sdk')
const settings = new NodeSettingsIniFile()
const session = new NodeSession(settings)
const sdk = new Looker40SDK(session)
const rp = require('request-promise');

module.exports.readSession = async (req, res, next) => {
  // console.log('readSession')
  let { session } = req
  session.lookerHost = lookerHostNameToUse; //lookerHostNameToUse
  if (session.userProfile) session = await checkForCustomizations(session)
  res.status(200).send({ session })
}

module.exports.writeSession = async (req, res, next) => {
  // console.log('writeSession')
  let { session } = req;
  session.userProfile = req.body.userProfile;
  session.lookerUser = req.body.lookerUser;
  session.lookerHost = lookerHostNameToUse; //lookerHostNameToUse;
  /**/
  //9/16 change external_user_id to emal instead of googleId to perform analysis
  session.lookerUser.external_user_id = session.userProfile.email; //.googleId;
  session.lookerUser.first_name = session.userProfile.givenName;
  session.lookerUser.last_name = session.userProfile.familyName;
  /**/

  /*
      RG 9/4:
      1) Added an iframe call to the looker server to ensure state is posted for any subsequent API calls
      2) Added a super-user call to the api to log in the api session for the user
      3) Saving the resulting bearer token into the datastore for future retrieval
  */

  // Calling the iframe url to ensure the embed user exists
  const url = await createSignedUrl('/alive', session.lookerUser, process.env.LOOKER_HOST, process.env.LOOKERSDK_EMBED_SECRET);
  await rp(url)

  // Initialize the API session, sudo and retrieve the bearer token
  const userCred = await sdk.ok(sdk.user_for_credential('embed', session.userProfile.googleId));

  const embeddedUserSession = new NodeSession(settings) // node wrapper
  ////instantiate new sdk client based on embedded session
  const embeddedUserSdk = new Looker40SDK(embeddedUserSession)
  ////ensure service account connected before sudoing
  const me = await embeddedUserSdk.ok(embeddedUserSdk.me())
  const embed_user_token = await embeddedUserSdk.login_user(userCred.id.toString())
  const u = {
    looker_user_id: userCred.id.toString()
    , google_id: session.userProfile.googleId
    // ,api_user_token: embed_user_token.value.access_token
    , api_user_token: embed_user_token.value
    , api_token_last_refreshed: Date.now()
  }
  // Save the bearer token in Mongo for future retrieval
  let r = await User.findOneAndUpdate({ google_id: session.userProfile.googleId }, u, {
    new: true,
    upsert: true,
    rawResult: true // Return the raw result from the MongoDB driver
  });
  // console.log(r)

  session.mongoInfo = { ...u }

  /* end RG 9/4 Changes */
  session = await checkForCustomizations(session)
  res.status(200).send({ session });
}

module.exports.endSession = async (req, res, next) => {
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