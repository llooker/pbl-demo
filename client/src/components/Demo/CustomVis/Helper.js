export default async function customVisHelper(inlineQuery) {
    // console.log('customVisHelper')
    // console.log('inlineQuery', inlineQuery)
    let stringifiedQuery = encodeURIComponent(JSON.stringify(inlineQuery))
    let lookerResponse = await fetch('/runinlinequery/' + stringifiedQuery + '/json', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    let lookerResponseData = await lookerResponse.json();
    //filter for null dates
    lookerResponseData.queryResults = lookerResponseData.queryResults.filter((queryResult) => {
        return queryResult[inlineQuery.fields[0]]
    });
    //create unique category array
    let uniqueCategories = ['All'];
    for (let i = 0; i < lookerResponseData.queryResults.length; i++) {
        if (uniqueCategories.indexOf(lookerResponseData.queryResults[i][inlineQuery.fields[1]]) == -1) {
            uniqueCategories.push(lookerResponseData.queryResults[i][inlineQuery.fields[1]])
        }
    }
    lookerResponseData.uniqueCategories = uniqueCategories;
    lookerResponseData.inlineQuery = inlineQuery;
    // console.log('1111 lookerResponseData', lookerResponseData)
    return { stateKey: 'customVisApiContent', stateValue: lookerResponseData }
}