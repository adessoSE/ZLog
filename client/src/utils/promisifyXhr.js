export function promisifyXhr(xhr) {
  return new Promise((resolve, reject) => {
    xhr
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
