export async function corsApiCall(func, args, user) {
  checkToken(user)
  func(...args)
}

function checkToken(user) {
  if (user.lookerTokenExpires > Date.now()) {
    let sessionResponse = await fetch('/refreshlookertoken', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    let sessionResponseData = await sessionResponse.json();
    const lookerHost = sessionResponseData.session.lookerHost
    const accessToken = sessionResponseData.session.lookerApiToken
    // const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + (sessionResponseData.session.lookerApiToken.api_user_token.expires_in * 1000)
    const lookerTokenExpires = sessionResponseData.session.lookerApiToken.api_token_last_refreshed + 10000;

    let sdk = createSdkHelper({ lookerHost, accessToken })

    this.setState({
      sdk,
      lookerTokenExpires
    }, () => {
      return lookerTokenExpires
    })
  } 
}

