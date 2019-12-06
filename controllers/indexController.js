'use strict'

const { LookerNodeSDK } = require('@looker/sdk')

module.exports.main = async (req, res, next) => {
    console.log('inside index controller')
    const sdk = LookerNodeSDK.createClient()
    console.log('sdk', sdk)
    const me = await sdk.ok(sdk.me(
        "id, first_name, last_name, display_name, email, personal_space_id, home_space_id, group_ids, role_ids"))
    console.log({ me }) //working :D
}