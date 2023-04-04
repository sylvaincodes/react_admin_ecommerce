import {
  GET_PVARIATIONATTRIBUTES,
  GET_PVARIATIONATTRIBUTES_FAIL,
  GET_PVARIATIONATTRIBUTES_SUCCESS,
  ADD_NEW_PVARIATIONATTRIBUTE,
  ADD_PVARIATIONATTRIBUTE_SUCCESS,
  ADD_PVARIATIONATTRIBUTE_FAIL,
  UPDATE_PVARIATIONATTRIBUTE,
  UPDATE_PVARIATIONATTRIBUTE_SUCCESS,
  UPDATE_PVARIATIONATTRIBUTE_FAIL,
  DELETE_PVARIATIONATTRIBUTE,
  DELETE_PVARIATIONATTRIBUTE_SUCCESS,
  DELETE_PVARIATIONATTRIBUTE_FAIL,
} from "./actionTypes"

export const getPvariationattributes = () => ({
  type: GET_PVARIATIONATTRIBUTES,
})

export const getPvariationattributesSuccess = pvariations => ({
  type: GET_PVARIATIONATTRIBUTES_SUCCESS,
  payload: pvariations,
})

export const addNewPvariationattribute = pvariation => ({
  type: ADD_NEW_PVARIATIONATTRIBUTE,
  payload: pvariation,
})

export const addPvariationattributeSuccess = pvariation => ({
  type: ADD_PVARIATIONATTRIBUTE_SUCCESS,
  payload: pvariation,
})

export const addPvariationattributeFail = error => ({
  type: ADD_PVARIATIONATTRIBUTE_FAIL,
  payload: error,
})

export const getPvariationattributesFail = error => ({
  type: GET_PVARIATIONATTRIBUTES_FAIL,
  payload: error,
})


export const updatePvariationattribute = pvariation => ({
  type: UPDATE_PVARIATIONATTRIBUTE,
  payload: pvariation,
})

export const updatePvariationattributeSuccess = pvariation => ({
  type: UPDATE_PVARIATIONATTRIBUTE_SUCCESS,
  payload: pvariation,
})

export const updatePvariationattributeFail = error => ({
  type: UPDATE_PVARIATIONATTRIBUTE_FAIL,
  payload: error,
})

export const deletePvariationattribute = pvariation => ({
  type: DELETE_PVARIATIONATTRIBUTE,
  payload: pvariation,
})

export const deletePvariationattributeSuccess = pvariation => ({
  type: DELETE_PVARIATIONATTRIBUTE_SUCCESS,
  payload: pvariation,
})

export const deletePvariationattributeFail = error => ({
  type: DELETE_PVARIATIONATTRIBUTE_FAIL,
  payload: error,
})
