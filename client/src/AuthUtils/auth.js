export const checkForExistingSession = async () => {
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