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
  const endSessionResponseData = await endSessionResponse.json();
  return { message: endSessionResponse };
}

export const createSdkHelper = ({ accessToken, lookerBaseUrl }) => {
  // console.log('createSdkHelper')
  // console.log({ accessToken })
  // console.log({ lookerBaseUrl })

  if (accessToken && lookerBaseUrl) { //added 11/22
    const pblsession = new PblSessionEmbed({
      ...DefaultSettings(),
      base_url: lookerBaseUrl,
      accessToken
    });

    let sdk = new Looker40SDK(pblsession);
    return sdk;
  }

}

export const checkToken = async (expires_in) => {
  // console.log('checkToken2');
  // console.log({ expires_in });
  // console.log('Date.now()', Date.now());
  // let dateeee = new Date(expires_in);
  // console.log({ dateeee })

  if ((Date.now()) > expires_in) {
    // console.log('inside iff')
    let sessionResponse = await fetch('/refreshlookertoken', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const sessionResponseData = await sessionResponse.json();
    const lookerBaseUrl = sessionResponseData.session.lookerBaseUrl ? sessionResponseData.session.lookerBaseUrl : '';
    const accessToken = sessionResponseData.session.lookerApiToken ? sessionResponseData.session.lookerApiToken.api_user_token : '';
    const sdk = createSdkHelper({ accessToken, lookerBaseUrl })

    return { status: "updated", sdk, clientSession: sessionResponseData.session }

  } else {
    // console.log("inside ellse")
    return { status: "ok" }
  }
}

