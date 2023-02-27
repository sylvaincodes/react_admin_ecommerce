import {
    ALERT_SUCCESS,
    ALERT_ERROR,
    ALERT_CLEAR
}  from "./actionTypes";


export const alertSuccess = (message) => {
    return{
        type: ALERT_SUCCESS,
        payload:message
    }
}

export const alertError = (message) => {
    return{
        type: ALERT_ERROR,
        payload:message
    }
}

export const alertClear = (message) => {
    return{
        type: ALERT_CLEAR,
        payload:message
    }
}

