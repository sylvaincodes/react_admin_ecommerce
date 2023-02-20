import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_SUCCESS,
  API_ERROR,
  API_TOKEN
} from "./actionTypes";

const initialState = {
  token: "",
  error: "",
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;

    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        error:""
      };
      break;
      
    case API_ERROR:
      state = {
        ...state,
        error: action.payload.error,
      };
      break;
      
      case API_TOKEN:
      state = {
        ...state,
        token: action.payload.token,
      };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
