import {
  GET_PVARIATIONS,
  GET_PVARIATIONS_FAIL,
  GET_PVARIATIONS_SUCCESS,
  ADD_NEW_PVARIATION,
  ADD_PVARIATION_SUCCESS,
  ADD_PVARIATION_FAIL,
  UPDATE_PVARIATION,
  UPDATE_PVARIATION_SUCCESS,
  UPDATE_PVARIATION_FAIL,
  DELETE_PVARIATION,
  DELETE_PVARIATION_SUCCESS,
  DELETE_PVARIATION_FAIL,
  SET_PVARIATION_SUCCESS,
} from "./actionTypes"

export const getPvariations = () => ({
  type: GET_PVARIATIONS,
})

export const getPvariationsSuccess = pvariations => ({
  type: GET_PVARIATIONS_SUCCESS,
  payload: pvariations,
})

export const addNewPvariation = pvariation => ({
  type: ADD_NEW_PVARIATION,
  payload: pvariation,
})

export const addPvariationSuccess = pvariation => ({
  type: ADD_PVARIATION_SUCCESS,
  payload: pvariation,
})

export const addPvariationFail = error => ({
  type: ADD_PVARIATION_FAIL,
  payload: error,
})

export const getPvariationsFail = error => ({
  type: GET_PVARIATIONS_FAIL,
  payload: error,
})


export const updatePvariation = pvariation => ({
  type: UPDATE_PVARIATION,
  payload: pvariation,
})

export const updatePvariationSuccess = pvariation => ({
  type: UPDATE_PVARIATION_SUCCESS,
  payload: pvariation,
})

export const updatePvariationFail = error => ({
  type: UPDATE_PVARIATION_FAIL,
  payload: error,
})

export const deletePvariation = pvariation => ({
  type: DELETE_PVARIATION,
  payload: pvariation,
})

export const deletePvariationSuccess = pvariation => ({
  type: DELETE_PVARIATION_SUCCESS,
  payload: pvariation,
})

export const deletePvariationFail = error => ({
  type: DELETE_PVARIATION_FAIL,
  payload: error,
})

export const setPvariationSuccess = pvariation => ({
  type: SET_PVARIATION_SUCCESS,
  payload: pvariation,
})
