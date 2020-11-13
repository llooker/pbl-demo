import { Looker40SDK, DefaultSettings } from "@looker/sdk";
import { PblSessionEmbed } from '../LookerHelpers/pblsession'

export const checkForExistingSession = async () => {
  // console.log('checkForExistingSession')
  let sessionResponse = await fetch('/readsession', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const sessionResponseData = await sessionResponse.json();
  return { session: sessionResponseData.session };
}

export const writeNewSession = async (newSession) => {
  // console.log('writeNewSession')
  let newSessionResponse = await fetch('/writesession', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...newSession })
  })
  const newSessionResponseData = await newSessionResponse.json();
  return { session: newSessionResponseData.session };
}

export const endSession = async () => {
  // console.log('endSession')
  let endSessionResponse = await fetch('/endsession', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  localStorage.clear();
  const endSessionResponseData = await endSessionResponse.json();
  return { message: endSessionResponse };
}

export const createSdkHelper = ({ accessToken, lookerHost }) => {
  // console.log('createSdkHelper')
  // console.log({ accessToken })
  // console.log({ lookerHost })
  let baseUrlToUse = lookerHost === 'pbldev' ? `https://${lookerHost}.looker.com` : `https://${lookerHost}.looker.com:19999`
  // console.log({ baseUrlToUse })
  const pblsession = new PblSessionEmbed({
    ...DefaultSettings(),
    base_url: baseUrlToUse,
    accessToken
  });

  let sdk = new Looker40SDK(pblsession);
  return sdk;
}

export const checkToken = async (expires_in) => { //sdk
  // console.log('checkToken')

  //valid sdk implementation
  // try {
  //   let meTest = await sdk.ok(sdk.me())
  //   // console.log({ meTest })
  //   return { status: "ok" }

  // } catch (error) {
  //   // console.log({ error })
  //   let sessionResponse = await fetch('/refreshlookertoken', {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   const sessionResponseData = await sessionResponse.json();
  //   // console.log({ sessionResponseData })
  //   const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
  //   const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
  //   const sdk = createSdkHelper({ lookerHost, accessToken })

  //   return { status: "updated", sdk, clientSession: sessionResponseData.session }
  // }

  //time-based implementation
  if (Date.now() > expires_in) {
    let sessionResponse = await fetch('/refreshlookertoken', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    const lookerHost = sessionResponseData.session.lookerHost ? sessionResponseData.session.lookerHost : this.state.lookerHost;
    const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
    const sdk = createSdkHelper({ lookerHost, accessToken })

    return { status: "updated", sdk, clientSession: sessionResponseData.session }

  } else return { status: "ok" }
}

