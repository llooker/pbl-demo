import _ from 'lodash'
const { validIdHelper } = require('../../../tools');

export default async function dashboardHelper(LookerEmbedSDK, demoComponent, lookerContent) {

    let dashboardId = lookerContent.id;
    let objForState = {}
    //await here is crucial
    let dashboardForState = await LookerEmbedSDK.createDashboardWithId(dashboardId)
        .appendTo(validIdHelper(`#embedContainer-${demoComponent.type}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        // .withNext(lookerContent.isNext || false) //how can I make this dynamic based on prop??
        .withTheme('Embedded')
        .on('drillmenu:click', (event) => typeof this[_.camelCase(demoComponent.type) + 'Action'] === 'function' ? this[_.camelCase(demoComponent.type) + 'Action'](event) : '')
        .build()
        .connect()
        .then((dashboard) => {
            ///ooollllllddddd
            // if (dashboardId) {
            //     console.log('inside this ifff???');
            //     objForState[dashboardId] = dashboard; //not working
            // }
            // if (dashboardId) {
            //     this.setState({
            //         [dashboardId]: dashboard
            //     })
            // }
            return { status: 'success', dashboardId, dashboard }
        })
        .catch((error) => {
            // console.error('Connection error', error)
            return { status: 'error', error }
        })

    if (dashboardForState.status === 'success') {
        objForState[dashboardForState.dashboardId] = dashboardForState.dashboard
    }

    if (lookerContent.hasOwnProperty('filter')) {
        let desiredResultFormat = lookerContent.filter.resultFormat || 'json_detail';
        let lookerResponse = await fetch('/runquery/' + lookerContent.filter.queryId + '/' + desiredResultFormat, {
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
        const stateKey = _.camelCase(demoComponent.type) + 'ApiContent';
        objForState[stateKey] = queryResultsForDropdown;
    }
    return objForState
}