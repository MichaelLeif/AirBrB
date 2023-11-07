
const path = 'https://localhost:5005'

function method (type, token = '', message = '') {
  return {
    method: type,
    headers: {
      'Content-type': 'application/json',
    },
  }
}

export async function getListings () {
  const response = await fetch(path + '/listings', method('GET'))
  return await response.json()
}
