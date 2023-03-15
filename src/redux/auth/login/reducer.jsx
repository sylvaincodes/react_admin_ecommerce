import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
} from "./actionTypes";


let userData = JSON.parse(localStorage.getItem('user'));
const initialState = userData
  ? {
      loggedIn: true,
      user : userData,
      error:{}
    }
  : {
    loggedIn: false,
    user : userData,
    error:{}
    };

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      state = {
        ...state,
        loggedIn: false,
      };
      break;

    case LOGIN_SUCCESS:
      state = {
        ...state,
        user : action.payload.user,
        loggedIn: true
      };
      break;

    case LOGIN_FAILURE:
      state = {
        ...state,
        loggedIn: false,
        error: action.payload,
      };
      break;

    case LOGOUT_REQUEST:
      state = {
        ...state,
        loggedIn: false 
      };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
