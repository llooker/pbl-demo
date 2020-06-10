export default async function queryBuilderHelper(newQuery, resultFormat) {
    console.log('queryBuilderHelper')
    console.log('newQuery', newQuery)
    console.log('resultFormat', resultFormat)


    let propsForComponent = {};
    console.log('0000 propsForComponent', propsForComponent)

    // let queryBuilderApiContent = { ...this.state.queryBuilderApiContent }
    // queryBuilderApiContent.status = 'running';
    // this.setState({ queryBuilderApiContent })

    let lookerCreateTaskResposnse = await fetch('/createquerytask/' + JSON.stringify(newQuery), {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    let lookerCreateTaskResponseData = await lookerCreateTaskResposnse.json();
    console.log('lookerCreateTaskResponseData', lookerCreateTaskResponseData)

    let taskInterval = setInterval(async () => {
        let lookerCheckTaskResposnse = await fetch('/checkquerytask/' + lookerCreateTaskResponseData.queryTaskId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let lookerCheckTaskResponseData = await lookerCheckTaskResposnse.json();
        console.log('lookerCheckTaskResponseData', lookerCheckTaskResponseData)
        console.log('lookerCheckTaskResponseData.queryResults.data', lookerCheckTaskResponseData.queryResults.data)

        if (lookerCheckTaskResponseData.queryResults.status === 'complete') {
            console.log('inside ifff')
            clearInterval(taskInterval)
            // this.setState({
            //     'queryBuilderApiContent': lookerCheckTaskResponseData.queryResults
            // })

            propsForComponent.apiContent = lookerCheckTaskResponseData.queryResults
            console.log('1111 propsForComponent', propsForComponent)
            return propsForComponent
        }
    }, 1000)
    console.log('taskInterval', taskInterval)
    return 'oooops'
}