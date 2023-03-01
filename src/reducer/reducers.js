let initialState = {
    loading: false,
    item: [],
    error: null
  };
  
  function reducer(state = initialState, action) {
    switch (action.type) {
      case "FETCH_DATA_REQUEST":
        return {
          ...state,
          loading: true,
          error: null
        };
      case "FETCH_DATA_SUCCESS":
      console.log('fetch gaurav',action);
        return {
          ...state,
          loading: false,
          item: action.payload.item
        };
      case "FETCH_DATA_ERROR":
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          item: []
        };
        case "EDIT_DATA_SUCCESS":
          console.log('30 got new data')
        return {
          ...state,
          randomstate : 'updated'+(new Date().getTime()),
          success: action.payload.response,
        };
        case "EDIT_DATA_ERROR":
        return {
          ...state,
          error: action.payload.error,
        };
      default:
        return state;
    }
  }
  
  export default reducer;
  