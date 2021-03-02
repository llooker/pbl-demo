import { Looker40SDK, DefaultSettings } from "@looker/sdk";
import { PblSessionEmbed } from './pblsession';

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
  console.log({ sessionResponseData })
  return { session: sessionResponseData.session };
}

export const writeNewSession = async (newSession) => {
  // console.log('writeNewSession')
  // console.log({ newSession })
  let newSessionResponse = await fetch('/writesession', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newSession)
  })
  console.log({ newSessionResponse })
  if (newSessionResponse.status === 200) {
    const newSessionResponseData = await newSessionResponse.json();
    return { status: newSessionResponse.status, session: newSessionResponseData.session };
  } else if (newSessionResponse.status === 307) {
    return { status: newSessionResponse.status };
  }
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
  try {
    const pblsession = new PblSessionEmbed({
      ...DefaultSettings(),
      base_url: lookerBaseUrl,
      accessToken
    });

    let sdk = new Looker40SDK(pblsession);
    return { status: "success", sdk };
  } catch (err) {
    return { status: "error", err }
  }

}

export const checkToken = async (expires_in) => {
  // console.log('checkToken');
  // console.log({ expires_in });

  if ((Date.now()) > expires_in) {
    return { status: "expired" }

  } else {
    return { status: "ok" }
  }
}

