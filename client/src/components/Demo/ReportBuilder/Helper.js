import _ from 'lodash'
const { validIdHelper } = require('../../../tools');

export default async function reportBuilderHelper(LookerEmbedSDK, demoComponent, lookerContent) {
    // console.log('reportBuilderHelper')
    // console.log('LookerEmbedSDK', LookerEmbedSDK)
    // console.log('demoComponent', demoComponent)
    // console.log('lookerContent', lookerContent)

    let objForState = {}
    if (lookerContent.type === 'folder') {
        let lookerResponse = await fetch('/fetchfolder/' + lookerContent.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })

        let lookerResponseData = await lookerResponse.json();
        let looksToUse = [...lookerResponseData.sharedFolder.looks, ...lookerResponseData.embeddedUserFolder.looks]
        let dashboardsToUse = [...lookerResponseData.sharedFolder.dashboards]
        let objToUse = {
            looks: looksToUse,
            dashboards: dashboardsToUse
        }

        if (objToUse.looks.length) {
            objToUse.looks.map((item, index) => {
                let lookId = item.id
                LookerEmbedSDK.createLookWithId(lookId)
                    .appendTo(validIdHelper(`#embedContainer-${demoComponent.type}-${lookerContent.id}`))
                    .withClassName('iframe')
                    .withClassName('look')
                    .withClassName(lookerResponseData.sharedFolder.looks.indexOf(item) > -1 ? "shared" : "personal")
                    .withClassName(index > 0 ? 'd-none' : 'oops')
                    .withClassName(lookId)
                    // .on('drillmenu:click', (e) => this.drillClick(e))
                    // .on('drillmodal:look', (event) => {
                    //     console.log('drillmodal:look')
                    //     console.log('event', event)
                    // })
                    // .on('drillmodal:explore', (event) => {
                    //     console.log('drillmodal:explore')
                    //     console.log('event', event)
                    // })
                    .build()
                    .connect()
                    // .then(this.setupLook)
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            })
        }

        if (objToUse.dashboards.length) {
            objToUse.dashboards.map((item, index) => {
                let dashboardId = item.id
                LookerEmbedSDK.createDashboardWithId(dashboardId)
                    .appendTo(validIdHelper(`#embedContainer-${demoComponent.type}-${lookerContent.id}`))
                    .withClassName('iframe')
                    .withClassName('dashboard')
                    .withClassName(lookerResponseData.sharedFolder.dashboards.indexOf(item) > -1 ? "shared" : "personal")
                    .withClassName('d-none')
                    .withClassName(dashboardId)
                    // .on('drillmenu:click', (e) => this.drillClick(e))
                    .build()
                    .connect()
                    // .then(this.setupLook)
                    .catch((error) => {
                        console.error('Connection error', error)
                    })
            })
        }

        const stateKey = _.camelCase(demoComponent.type) + 'ApiContent';
        objForState[stateKey] = objToUse; //[...looksToUse, ...dashboardsToUse]; //objToUse;
    } else if (lookerContent.type === 'explore') {
        LookerEmbedSDK.createExploreWithId(lookerContent.id)
            .appendTo(validIdHelper(`#embedContainer-${demoComponent.type}-${lookerContent.id}`))
            .withClassName('iframe')
            .on('explore:state:changed', (event) => {
                // console.log('explore:state:changed')
                // console.log('event', event)
            })
            .build()
            .connect()
            .then((explore) => {
                // // console.log('explore then callback')
            })
            .catch((error) => {
                console.error('Connection error', error)
            })

    }

    return objForState

}