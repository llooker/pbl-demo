export default async function customVisHelper(inlineQuery) {
    // console.log('customVisHelper')
    // console.log('000 inlineQuery', inlineQuery)

    let stringifiedQuery = encodeURIComponent(JSON.stringify(inlineQuery))
    let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    let lookerResponseData = await lookerResponse.json();
    console.log('111 lookerResponseData', lookerResponseData)
    //this could be improved
    let queryResultsForCustomVis = { status: 'running', originalData: [[], []], data: [[], []] };
    let dateProperty = Object.keys(lookerResponseData.queryResults[0])[0];
    let categoryProperty = Object.keys(lookerResponseData.queryResults[0])[1];
    let orderCountProperty = Object.keys(lookerResponseData.queryResults[0])[2];
    let salePriceProperty = Object.keys(lookerResponseData.queryResults[0])[3];
    let uniqueCategories = ['All']
    for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
        if (lookerResponseData.queryResults[i][dateProperty]) {
            queryResultsForCustomVis.originalData[0].push({
                'day': lookerResponseData.queryResults[i][dateProperty],
                'value': lookerResponseData.queryResults[i][salePriceProperty],
                'category': lookerResponseData.queryResults[i][categoryProperty]
            })
            queryResultsForCustomVis.data[0].push({
                'day': lookerResponseData.queryResults[i][dateProperty],
                'value': lookerResponseData.queryResults[i][salePriceProperty],
                'category': lookerResponseData.queryResults[i][categoryProperty]
            })
            queryResultsForCustomVis.originalData[1].push({
                'day': lookerResponseData.queryResults[i][dateProperty],
                'value': lookerResponseData.queryResults[i][orderCountProperty],
                'category': lookerResponseData.queryResults[i][categoryProperty]
            })
            queryResultsForCustomVis.data[1].push({
                'day': lookerResponseData.queryResults[i][dateProperty],
                'value': lookerResponseData.queryResults[i][orderCountProperty],
                'category': lookerResponseData.queryResults[i][categoryProperty]
            })

            if (uniqueCategories.indexOf(lookerResponseData.queryResults[i][categoryProperty]) == -1) {
                uniqueCategories.push(lookerResponseData.queryResults[i][categoryProperty])
            }
        }
    }
    queryResultsForCustomVis.status = "complete";
    queryResultsForCustomVis.inlineQuery = inlineQuery;
    queryResultsForCustomVis.uniqueCategories = uniqueCategories;
    // console.log('111 queryResultsForCustomVis', queryResultsForCustomVis)
    const stateKey = 'customVisApiContent';
    // this.setState({
    //     [stateKey]: queryResultsForCustomVis
    // })
    return { stateKey: stateKey, stateValue: queryResultsForCustomVis }
}