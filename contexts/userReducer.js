export const initialState = {
  session_user: null,
  user_details:null
};

export const actionTypes = {
  SET_SESSION_DATA: 'SET_SESSION_DATA',
  SET_USER_DETAILS: 'SET_USER_DETAILS',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_SESSION_DATA:
      return {
        ...state,
        session_user: action.data,
      };
    case actionTypes.SET_USER_DETAILS:
      return {
        ...state,
        user_details: action.data,
      };
    default:
      return state;
    }
};

export default reducer;