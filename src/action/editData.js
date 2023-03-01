import { editDataSuccess, editDataError, fetchDataSuccess } from "./action";
import { fetchData } from "./fetchData";
import config from '../config/config';

const BEARER_TOKEN = localStorage.getItem("userData");
export function editData(datas, apiUrl, bearer){
    return dispatch => {
          const options = {
            method: 'POST',
            headers:{
              'Authorization': bearer,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(datas)
          };
          // console.log(datas)
          fetch(apiUrl, options)
            .then(res => {
                dispatch(editDataSuccess(datas));
                res.json().then(data => {
                  dispatch(fetchDataSuccess(data))
              })
            })
            .then(result => {
                //console.log(result)
            },
            (error) => {
                dispatch(editDataError(error));
                //console.log(error)
            }
          )
  }
}