export const createEmbeddedExtension = async ({ LookerEmbedSDK, lookerContentItem, containerId, clientSession }) => {
  // console.log("createEmbeddedExtension")
  // console.log({ LookerEmbedSDK })
  // console.log({ lookerContentItem })
  // console.log({ containerId })
  let extensionId = lookerContentItem.id;
  console.log({ extensionId })

  let returnObj = await LookerEmbedSDK.createExtensionWithId(extensionId)
    .appendTo(containerId)
    .withClassName('iframe')
    .withClassName('extensionIFrame')
    .build()
    .connect()
    .then((extension) => {
      let modifiedBaseUrl = clientSession.lookerBaseUrl.substring(0, clientSession.lookerBaseUrl.lastIndexOf(":"));
      LookerEmbedSDK.init(modifiedBaseUrl)
      return { iframe: 1, extensionObj: extension }
    })
    .catch((error) => {
      console.error('Connection error', error)
    })
  return returnObj
}