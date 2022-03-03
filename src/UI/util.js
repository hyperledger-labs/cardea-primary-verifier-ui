export const handleImageSrc = (rawImage) => {
  let bytes = new Uint8Array(rawImage)
  bytes = Buffer.from(rawImage).toString('base64')

  // Check the MIME type
  let result = null
  if (atob(bytes).charAt(0) === 'i')
    result = `data:image/png;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === '/')
    result = `data:image/jpeg;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === 'R')
    result = `data:image/gif;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === 'U')
    result = `data:image/webp;base64,${atob(bytes)}`
  else result = atob(bytes)
  return result
}

// Format seconds
export function formatSeconds(secs) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  var h = Math.floor(secs / 3600)
  var m = Math.floor(secs / 60) - h * 60
  var s = Math.floor(secs - h * 3600 - m * 60)

  // return pad(h) +":"+ pad(m) +":"+ pad(s);
  return pad(m) + ':' + pad(s)
}

// Governance approval
export function handleGovernance(privileges, actions, participants) {
  console.log(privileges)
  console.log(actions)
  console.log(participants)

  // Got privileges DONE but how to handle multiple privileges
  if (privileges && privileges.includes('verify_identity')) {
    console.log('got privileges')
    return true
  }
  // Privileges, actions and participants don't exist DONE
  else if (
    (privileges === undefined || privileges.length == 0) &&
    (actions === undefined || actions.length == 0) &&
    (participants === undefined || participants.length == 0)
  ) {
    console.log("privileges, actions and participants don't exist")
    return true
  }
  // Privileges, actions and participants are missing DONE
  else if (
    privileges.includes('ignore_privileges') &&
    actions.includes('ignore_actions') &&
    participants.includes('ignore_participants')
  ) {
    console.log('privileges, actions and participants are missing')
    return true
  }
  // Privileges, participants are missing, but actions are set DONE
  else if (
    privileges.includes('ignore_privileges') &&
    !actions.includes('ignore_actions') &&
    participants.includes('ignore_participants')
  ) {
    console.log('privileges and participants are missing, but actions are set')
    return true
  }
  // Privileges, actions are missing, but participants are set DONE
  else if (
    privileges.includes('ignore_privileges') &&
    actions.includes('ignore_actions') &&
    !participants.includes('ignore_participants')
  ) {
    console.log('privileges and actions are missing, but participants are set')
    return true
  }
  // Privileges are missing, but participants and actions are set DONE
  else if (
    privileges.includes('ignore_privileges') &&
    !actions.includes('ignore_actions') &&
    !participants.includes('ignore_participants')
  ) {
    console.log('privileges are missing, but participants and actions are set')
    return true
  } else return false
}
