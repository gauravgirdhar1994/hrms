export function DataFetchBody(BaseURL, Token, bodydata) {
    return new Promise((resolve, reject) =>{
    const options = {
    method: 'POST',
    headers:{
    'Authorization': Token,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
    body:JSON.stringify({
        "month": bodydata
      })
    };
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