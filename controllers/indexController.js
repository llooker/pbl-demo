'use strict'

const { LookerNodeSDK } = require('@looker/sdk')
const config = require('../config');

var crypto = require('crypto');
var querystring = require('querystring');



module.exports.main = async (req, res, next) => {
    console.log('indexController main');
    console.log('req.session', req.session)

    // const sdk = LookerNodeSDK.createClient() //valid client :D

    // for testing purposes
    // const me = await sdk.ok(sdk.me(
    //     "id, first_name, last_name, display_name, email, personal_space_id, home_space_id, group_ids, role_ids"))
    // // console.log({ me }) //working :D

    //api calls
    // const looks = await sdk.ok(sdk.all_looks())
    // const dashboards = await sdk.ok(sdk.all_dashboards())
    // const session = await sdk.ok(sdk.session())

    var embed_url = await sample(req.session);
    console.log('embed_url', embed_url)
    let resObj = { embed_url }

    res.send(resObj)
}

function nonce(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


//helper functions for creating embed url
//from here: https://github.com/looker/looker_embed_sso_examples/blob/master/node_example.js
function forceUnicodeEncoding(string) {
    return decodeURIComponent(encodeURIComponent(string));
}

function created_signed_embed_url(options) {
    // looker options
    var secret = options.secret;
    var host = options.host;

    // user options
    var json_external_user_id = JSON.stringify(options.external_user_id);
    var json_first_name = JSON.stringify(options.first_name);
    var json_last_name = JSON.stringify(options.last_name);
    var json_permissions = JSON.stringify(options.permissions);
    var json_models = JSON.stringify(options.models);
    var json_group_ids = JSON.stringify(options.group_ids);
    var json_external_group_id = JSON.stringify(options.external_group_id || "");
    var json_user_attributes = JSON.stringify(options.user_attributes || {});
    var json_access_filters = JSON.stringify(options.access_filters);

    // url/session specific options
    var embed_path = '/login/embed/' + encodeURIComponent(options.embed_url);
    var json_session_length = JSON.stringify(options.session_length);
    var json_force_logout_login = JSON.stringify(options.force_logout_login);

    // computed options
    var json_time = JSON.stringify(Math.floor((new Date()).getTime() / 1000));
    var json_nonce = JSON.stringify(nonce(16));

    // compute signature
    var string_to_sign = "";
    string_to_sign += host + "\n";
    string_to_sign += embed_path + "\n";
    string_to_sign += json_nonce + "\n";
    string_to_sign += json_time + "\n";
    string_to_sign += json_session_length + "\n";
    string_to_sign += json_external_user_id + "\n";
    string_to_sign += json_permissions + "\n";
    string_to_sign += json_models + "\n";
    string_to_sign += json_group_ids + "\n";
    string_to_sign += json_external_group_id + "\n";
    string_to_sign += json_user_attributes + "\n";
    string_to_sign += json_access_filters;

    var signature = crypto.createHmac('sha1', secret).update(forceUnicodeEncoding(string_to_sign)).digest('base64').trim();

    // construct query string
    var query_params = {
        nonce: json_nonce,
        time: json_time,
        session_length: json_session_length,
        external_user_id: json_external_user_id,
        permissions: json_permissions,
        models: json_models,
        access_filters: json_access_filters,
        first_name: json_first_name,
        last_name: json_last_name,
        group_ids: json_group_ids,
        external_group_id: json_external_group_id,
        user_attributes: json_user_attributes,
        force_logout_login: json_force_logout_login,
        signature: signature
    };

    var query_string = querystring.stringify(query_params);

    return host + embed_path + '?' + query_string;
}

function sample(session) {
    var fifteen_minutes = 15 * 60;

    var url_data = {
        host: config.looker.host,
        secret: config.looker.embed_secret,
        external_user_id: session.userProfile.googleId,
        first_name: session.userProfile.givenName,
        last_name: session.userProfile.familyName,
        group_ids: [1], //not required?
        // external_group_id: 'awesome_engineers', //not required
        permissions: ['access_data', 'see_looks', 'see_user_dashboards'],
        models: ['citibike'],
        access_filters: {
            fake_model: {
                id: 1
            }
        },
        //user_attributes: { "an_attribute_name": "my_attribute_value", "my_number_attribute": "42" },
        session_length: fifteen_minutes,
        embed_url: "/embed/dashboards/2",
        force_logout_login: true
    };

    var url = created_signed_embed_url(url_data);
    return "https://" + url;
}


module.exports.session = async (req, res, next) => {
    let session = req.session //get session
    res.status(200).send({ session }) //send whole session back
}


module.exports.writeSession = async (req, res, next) => {
    let session = req.session
    session.userProfile = req.body //overwrite userprofile
    res.status(200).send({ session });
}
