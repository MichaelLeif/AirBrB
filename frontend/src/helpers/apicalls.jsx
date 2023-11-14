export const getToken = () => {
  return localStorage.getItem('token');
}

export const getUser = () => {
  return localStorage.getItem('user');
}

export const apiCall = (type, path, body, authed = false) => {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005${path}`, {
      method: type,
      headers: {
        'Content-type': 'application/json',
        Authorization: authed ? `Bearer ${getToken()}` : undefined
      },
      body: type === 'POST' || type === 'PUT' ? JSON.stringify(body) : undefined
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.error) {
          reject(body);
        } else {
          resolve(body);
        }
      });
  });
}
