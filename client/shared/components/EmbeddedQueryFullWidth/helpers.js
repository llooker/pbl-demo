const { validIdHelper, appContextMap, validateContent } = require('../../utils/tools');

export const createEmbeddedExplore = async ({ LookerEmbedSDK, lookerContentItem, containerId, clientSession }) => {
  console.log("createEmbeddedExplore")
  // console.log({ LookerEmbedSDK })
  // console.log({ lookerContentItem })
  // console.log({ containerId })

  const idToUse = validIdHelper(`embedContainer-${lookerContentItem.type}-${lookerContentItem.id}`);

  let queryUrlToUse = document.location.origin.indexOf("govportal.io") > -1 ? lookerContentItem.queryUrlDev : lookerContentItem.queryUrlDev;
  console.log({ queryUrlToUse })
  let queryUrl = encodeURIComponent(`${queryUrlToUse}${document.location.origin}`)
  let returnObj = await fetch(`/auth?src=${queryUrl}`)
    .then(response => response.json())
    .then(data => {

      LookerEmbedSDK.createExploreWithUrl(data.url)
        .appendTo(document.getElementById(idToUse))
        .withClassName('exploreIframe')
        .withClassName('explore')
        .withClassName(lookerContentItem.id)
        .withTheme('atom_fashion')
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