const { validIdHelper, appContextMap, validateContent } = require('../../utils/tools');

export const createEmbeddedExplore = async ({ LookerEmbedSDK, lookerContentItem, containerId, clientSession }) => {
  // console.log("createEmbeddedExplore")
  // console.log({ LookerEmbedSDK })
  // console.log({ lookerContentItem })
  // console.log({ containerId })

  const idToUse = validIdHelper(`embedContainer-${lookerContentItem.type}-${lookerContentItem.id}`);

  let queryUrlToUse = document.location.origin.indexOf("govportal.io") > -1 ? lookerContentItem.queryUrlDev : lookerContentItem.queryUrlDev;
  // console.log({ queryUrlToUse })
  let queryUrl = encodeURIComponent(`${queryUrlToUse}${document.location.origin}`)
  let returnObj = await fetch(`/auth?src=${queryUrl}`)
    .then(response => response.json())
    .then(data => {

      LookerEmbedSDK.createExploreWithUrl(data.url)
        .appendTo(document.getElementById(idToUse))
        .withClassName('exploreIframe')
        .withClassName('explore')
        .withClassName(lookerContentItem.id)
        // .on('drillmenu:click', drillMenuClick)
        .withTheme(lookerContentItem.theme || "")
        .build()
        .connect()
        .then((explore) => {
          let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
          LookerEmbedSDK.init(modifiedBaseUrl)
          return { iframe: 1, exploreObj: explore }
        })
        .catch((error) => {
          console.error('Connection error', error)
        })
    })
  return returnObj
}


/**
 * TO DO
 * feature request for eng
 */
// const drillMenuClick = (event) => {
//   console.log("drillMenuClick")
//   console.log({ event })

//   // if (_.includes(_.lowerCase(event.label), "w2")) {
//   //   history.push({
//   //     pathname: 'eligibilitydocs',
//   //     search: (`pdf_url=${event.url}`)
//   //   })
//   //   return { cancel: true }
//   // } else if (_.includes(_.lowerCase(event.label), "1099")) {
//   //   history.push({
//   //     pathname: 'eligibilitydocs',
//   //     search: (`pdf_url=${event.url}`)
//   //   })
//   //   return { cancel: true }
//   // } else if (_.includes(_.lowerCase(event.label), "application")) {
//   //   history.push({
//   //     pathname: 'application',
//   //     search: (`${encodeURIComponent("Application ID")}=${event.url}`)
//   //   })
//   //   return { cancel: true }
//   // } else if (_.includes(_.lowerCase(event.label), "beneficiary")) {
//   //   history.push({
//   //     pathname: 'beneficiary',
//   //     search: (`${encodeURIComponent("Person ID")}=${event.url}`)
//   //   })
//   //   return { cancel: true }
//   // }
// }