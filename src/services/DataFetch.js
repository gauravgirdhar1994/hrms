export function DataFetch(BaseURL, Token) {
    return new Promise((resolve, reject) =>{
    const options = {
    method: 'GET',
    headers:{
    'Authorization': Token,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    }};
    fetch(BaseURL, options)
        .then((response) => response.json())
        .then((res) => {
            resolve(res);
        })
        .catch((error) => {
            reject(error);
        });
   });
   }