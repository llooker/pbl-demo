import _ from 'lodash'
const { validIdHelper } = require('../../../tools');

export default async function dashboardHelper(LookerEmbedSDK, demoComponent, lookerContent) {

    // console.log('dashboardHelper')
    // console.log('demoComponent', demoComponent)
    // console.log('lookerContent', lookerContent)

    let propsForComponent = {}
    let dashboardId = lookerContent.id;
    //await here is crucial
    let dashboardObj = await LookerEmbedSDK.createDashboardWithId(dashboardId)
        .appendTo(validIdHelper(`#embedContainer-${demoComponent.type}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        // .withNext(lookerContent.isNext || false) //how can I make this dynamic based on prop??
        .withTheme('Embedded')
        .on('drillmenu:click', (event) => typeof this[_.camelCase(demoComponent.type) + 'Action'] === 'function' ? this[_.camelCase(demoComponent.type) + 'Action'](event) : '')
        .build()
        .connect()
        .then((dashboard) => {
            return { status: 'success', dashboardId, dashboard }
        })
        .catch((error) => {
            // console.error('Connection error', error)
            return { status: 'error', error }
        })

    if (dashboardObj.status === 'success') {
        propsForComponent[dashboardObj.dashboardId] = dashboardObj.dashboard
    }

    if (lookerContent.hasOwnProperty('filter')) {
        let stringifiedQuery = encodeURIComponent(JSON.stringify(lookerContent.inlineQuery))
        let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let lookerResponseData = await lookerResponse.json();
        let queryResultsForDropdown = [];
        let desiredProperty = Object.keys(lookerResponseData.queryResults[0])[0];
        for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
            queryResultsForDropdown.push({ 'label': lookerResponseData.queryResults[i][desiredProperty] })
        }

        propsForComponent.apiContent = queryResultsForDropdown;
    }
    return propsForComponent;
}