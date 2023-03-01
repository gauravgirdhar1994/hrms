import { fetchDataRequest, fetchDataSuccess, fetchDataError } from "./action";

export function fetchData(apiUrl, bearer) {
    return dispatch => {
        dispatch(fetchDataRequest());
    //const apiUrl = 'http://apihrmsuat.91wheels.com/api/employee/view/1101';
    //var bearer = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.W3siaWQiOjEsInVzZXJuYW1lIjoiZ2F1cmF2IiwicGFzc3dvcmQiOiI1ZjRkY2MzYjVhYTc2NWQ2MWQ4MzI3ZGViODgyY2Y5OSIsInJvbGUiOjEsIm9yZ0lkIjoxLCJjcmVhdGVkQnkiOjAsInVwZGF0ZWRCeSI6MSwiY3JlYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1Ni4wMDBaIiwidXBkYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1OC4wMDBaIn1d.IqR7mfVoWTa93xl0xqCKg4Sd_Gex8CAdtZZ26E250j4';
    const options = {
        method: 'GET',
        headers:{
        'Authorization': bearer,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        }
    };
    fetch(apiUrl, options)
      .then(response =>{
        response.json().then(data => {
          dispatch(fetchDataSuccess(data))
          //console.log('actionnnnnnnnn', data)
      })
      
    })
    .catch(error =>{
        dispatch(fetchDataError(error));
    })
 }
}
