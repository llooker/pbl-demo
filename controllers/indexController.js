'use strict'

const { LookerNodeSDK } = require('@looker/sdk')

module.exports.main = async (req, res, next) => {
    const sdk = LookerNodeSDK.createClient() //valid client :D

    // for testing purposes
    // const me = await sdk.ok(sdk.me(
    //     "id, first_name, last_name, display_name, email, personal_space_id, home_space_id, group_ids, role_ids"))
    // // console.log({ me }) //working :D

    const looks = await sdk.ok(sdk.all_looks())
    const session = await sdk.ok(sdk.session())
    let resObj = { looks, session }
    res.send(resObj)
}