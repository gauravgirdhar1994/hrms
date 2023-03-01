import {
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    FETCH_DATA_ERROR,
    EDIT_DATA_ERROR,
    EDIT_DATA_SUCCESS
  } from "./actionType";
  
  export function fetchDataRequest() {
    //console.log('fetch data req');
    return {
      type: FETCH_DATA_REQUEST
    };
  }
  
  export function fetchDataSuccess(item) {
   // console.log('fetch data success',item);
    return {
      type: FETCH_DATA_SUCCESS,
      payload:{item }
    };
  }
  
  export function fetchDataError(error) {
    return { 
      type: FETCH_DATA_ERROR,
      payload: { error }
    };
  }

  export function editDataError(error) {
    return {
      type: EDIT_DATA_ERROR,
      payload: { error }
    };
  }

  export function editDataSuccess(item) {
    //console.log('Edit Item', item);
    return {
      type: EDIT_DATA_SUCCESS,
      payload: { item , editData : item}
    };
  }