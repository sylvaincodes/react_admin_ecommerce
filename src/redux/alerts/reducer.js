import { ALERT_SUCCESS, ALERT_ERROR, ALERT_CLEAR } from "./actionTypes";

initialState = {
  alert:{}
};

const alert = (state = initialState, action) => {
  switch (action.type) {
    case "ALERT_SUCCESS":
      state = {
        ...state,
        alert: action.payload,
      };
      break;
    case "ALERT_ERROR":
      state = {
        ...state,
        alert: action.payload,
      };
      break;
      
      
    case "ALERT_CLEAR":
      state = {
        ...state,
        alert: action.payload,
      };
      break;

    default:
        return state = {
            ...state,
            alert: {}
          };
      break;
  }

};
