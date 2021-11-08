export const initialState = {
  session_user: null,
  user_details:null,
  user_details_status:true,
  transaction_details: null
};

export const actionTypes = {
  SET_SESSION_DATA: 'SET_SESSION_DATA',
  SET_USER_DETAILS: 'SET_USER_DETAILS',
  SET_USER_DETAILS_STATUS: 'SET_USER_DETAILS_STATUS',
  SET_TRANSACTION_DETAILS: 'SET_TRANSACTION_DETAILS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_SESSION_DATA:
      // console.log(`Session Data from Reducer`)
      // console.log(action.data)
      return {
        ...state,
        session_user: action.data,
      };
    case actionTypes.SET_USER_DETAILS:
      return {
        ...state,
        user_details: action.data,
      };
    case actionTypes.SET_USER_DETAILS_STATUS:
      return {
        ...state,
        user_details_status: action.data,
      };
    case actionTypes.SET_TRANSACTION_DETAILS:
      return {
        ...state,
        transaction_details: action.data,
      };
    default:
      return state;
    }
};

export default reducer;