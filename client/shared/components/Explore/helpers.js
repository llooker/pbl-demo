export const createEmbeddedExplore = async ({ LookerEmbedSDK, lookerContentItem, containerId, clientSession }) => {
  // console.log("createEmbeddedExplore")
  // console.log({ LookerEmbedSDK })
  // console.log({ lookerContentItem })
  // console.log({ containerId })

  let exploreId = lookerContentItem.id;
  let qid = lookerContentItem.qid;
  if (qid) {
    let returnObj = await LookerEmbedSDK.createExploreWithId(exploreId)
      .appendTo(containerId)
      .withClassName('exploreIframe')
      .withParams({
        qid: lookerContentItem.qid,
        toggle: "&toggle=dat,vis"
      })
      .on('explore:state:changed', (event) => {
      })
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
    console.log({ returnObj })
    return returnObj
  } else {
    let returnObj = await LookerEmbedSDK.createExploreWithId(exploreId)
      .appendTo(containerId)
      .withClassName('exploreIframe')
      .withParams({
        toggle: "&toggle=vis"
      })
      .on('explore:state:changed', (event) => {
      })
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
    return returnObj
  }
}