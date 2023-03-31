import {
  GET_PATTRIBUTES,
  GET_PATTRIBUTES_FAIL,
  GET_PATTRIBUTES_SUCCESS,
  ADD_NEW_PATTRIBUTE,
  ADD_PATTRIBUTE_SUCCESS,
  ADD_PATTRIBUTE_FAIL,
  UPDATE_PATTRIBUTE,
  UPDATE_PATTRIBUTE_SUCCESS,
  UPDATE_PATTRIBUTE_FAIL,
  DELETE_PATTRIBUTE,
  DELETE_PATTRIBUTE_SUCCESS,
  DELETE_PATTRIBUTE_FAIL,
} from "./actionTypes"

export const getPattributes = () => ({
  type: GET_PATTRIBUTES,
})

export const getPattributesSuccess = pattributes => ({
  type: GET_PATTRIBUTES_SUCCESS,
  payload: pattributes,
})

export const addNewPattribute = pattribute => ({
  type: ADD_NEW_PATTRIBUTE,
  payload: pattribute,
})

export const addPattributeSuccess = pattribute => ({
  type: ADD_PATTRIBUTE_SUCCESS,
  payload: pattribute,
})

export const addPattributeFail = error => ({
  type: ADD_PATTRIBUTE_FAIL,
  payload: error,
})

export const getPattributesFail = error => ({
  type: GET_PATTRIBUTES_FAIL,
  payload: error,
})


export const updatePattribute = pattribute => ({
  type: UPDATE_PATTRIBUTE,
  payload: pattribute,
})

export const updatePattributeSuccess = pattribute => ({
  type: UPDATE_PATTRIBUTE_SUCCESS,
  payload: pattribute,
})

export const updatePattributeFail = error => ({
  type: UPDATE_PATTRIBUTE_FAIL,
  payload: error,
})

export const deletePattribute = pattribute => ({
  type: DELETE_PATTRIBUTE,
  payload: pattribute,
})

export const deletePattributeSuccess = pattribute => ({
  type: DELETE_PATTRIBUTE_SUCCESS,
  payload: pattribute,
})

export const deletePattributeFail = error => ({
  type: DELETE_PATTRIBUTE_FAIL,
  payload: error,
})
