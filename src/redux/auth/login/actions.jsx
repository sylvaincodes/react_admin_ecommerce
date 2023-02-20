import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    LOGOUT_SUCCESS,
    API_ERROR,
    API_TOKEN
}

from './actionTypes';

export const loginUser = (user , history) => {
    return{
        type: LOGIN_USER,
        payload:{ user, history }
    }
}

export const loginSuccess = (user , history) => {
    return{
        type: LOGIN_SUCCESS,
        payload:{ user, history }
    }
}

export const loginError = (error , history) => {
    return{
        type: API_ERROR,
        payload:{ error, history }
    }
}

export const saveToken = (token , history) => {
    return{
        type: API_TOKEN,
        payload:{ token, history }
    }
}
