import _ from 'lodash'

export default async function dashboardHelper(lookerContent) {
    console.log('dashboardHelper');
    console.log('lookerContent', lookerContent);
    let objForState = {}
    let dashboardId = lookerContent.id;
    LookerEmbedSDK.createDashboardWithId(lookerContent.id)
        .appendTo(validIdHelper(`#embedContainer-${lookerContent.type}-${dashboardId}`))
        .withClassName('iframe')
        .withNext()
        // .withNext(usecaseContent[j].lookerContent[i].isNext || false) //how can I make this dynamic based on prop??
        .withTheme('Embedded')
        .on('drillmenu:click', (event) => typeof this[_.camelCase(lookerContent.type) + 'Action'] === 'function' ? this[_.camelCase(usecaseContent[j].type) + 'Action'](event) : '')
        .build()
        .connect()
        .then((dashboard) => {
            // console.log('then callback dashboardId', dashboardId)
            if (dashboardId) objForState[dashboardId] = dashboard; //not working
            // if (dashboardId) {
            //     this.setState({
            //         [dashboardId]: dashboard
            //     })
            // }
        })
        .catch((error) => {
            console.error('Connection error', error)
        })

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
        for (i = 0; i < lookerResponseData.queryResults.length; i++) {
            queryResultsForDropdown.push({ 'label': lookerResponseData.queryResults[i][desiredProperty] })
        }
        const stateKey = _.camelCase(lookerContent.type) + 'ApiContent';
        objForState[stateKey] = queryResultsForDropdown;
        return objForState;
    }
}