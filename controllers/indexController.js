'use strict'

const { LookerNodeSDK } = require('@looker/sdk')

module.exports.main = async (req, res, next) => {
    console.log('inside index controller')
    const sdk = LookerNodeSDK.createClient() //valid client :D

    // for testing purposes
    // const me = await sdk.ok(sdk.me(
    //     "id, first_name, last_name, display_name, email, personal_space_id, home_space_id, group_ids, role_ids"))
    // // console.log({ me }) //working :D

    const looks = await sdk.ok(sdk.all_looks())
    // console.log({ looks }) //working :D
    res.send(looks)
}