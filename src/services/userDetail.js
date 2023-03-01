
import React, { Component } from 'react';
  
  class userDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data : [],
        }
      }

    refreshList(){
        const apiUrl = 'http://apihrmsuat.91wheels.com/api/employee/view/1101';
        var bearer = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.W3siaWQiOjEsInVzZXJuYW1lIjoiZ2F1cmF2IiwicGFzc3dvcmQiOiI1ZjRkY2MzYjVhYTc2NWQ2MWQ4MzI3ZGViODgyY2Y5OSIsInJvbGUiOjEsIm9yZ0lkIjoxLCJjcmVhdGVkQnkiOjAsInVwZGF0ZWRCeSI6MSwiY3JlYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1Ni4wMDBaIiwidXBkYXRlZE9uIjoiMjAyMC0wNC0zMFQxOToyMDo1OC4wMDBaIn1d.IqR7mfVoWTa93xl0xqCKg4Sd_Gex8CAdtZZ26E250j4';
        const options = {
          method: 'POST',
          headers:{
            'Authorization': bearer,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        };
        fetch(apiUrl, options)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(datas => this.setState({ data: datas }))
      }
  }
  
  export default userDetail;

//   export function userDetail(type, userData) {
//     let BaseURL = 'http://apihrmsuat.91wheels.com/api/employee/view/1101';
//     //let BaseURL = 'http://localhost/PHP-Slim-Restful/api/';
//     return new Promise((resolve, reject) =>{
//     fetch(BaseURL+type, {
//    method: 'POST',
//    body: JSON.stringify(userData)
//    })
//    .then((response) => response.json())
//    .then((res) => {
//     resolve(res);
//    })
//    .catch((error) => {
//     reject(error);
//    });
//    });
//    }