import {
  GET_PATTRIBUTEITEMS,
  GET_PATTRIBUTEITEMS_FAIL,
  GET_PATTRIBUTEITEMS_SUCCESS,
  ADD_NEW_PATTRIBUTEITEM,
  ADD_PATTRIBUTEITEM_SUCCESS,
  ADD_PATTRIBUTEITEM_FAIL,
  UPDATE_PATTRIBUTEITEM,
  UPDATE_PATTRIBUTEITEM_SUCCESS,
  UPDATE_PATTRIBUTEITEM_FAIL,
  DELETE_PATTRIBUTEITEM,
  DELETE_PATTRIBUTEITEM_SUCCESS,
  DELETE_PATTRIBUTEITEM_FAIL,
} from "./actionTypes"

export const getPattributeitems = () => ({
  type: GET_PATTRIBUTEITEMS,
})

export const getPattributeitemsSuccess = pattributeitems => ({
  type: GET_PATTRIBUTEITEMS_SUCCESS,
  payload: pattributeitems,
})

export const addNewPattributeitem = pattributeitem => ({
  type: ADD_NEW_PATTRIBUTEITEM,
  payload: pattributeitem,
})

export const addPattributeitemSuccess = pattributeitem => ({
  type: ADD_PATTRIBUTEITEM_SUCCESS,
  payload: pattributeitem,
})

export const addPattributeitemFail = error => ({
  type: ADD_PATTRIBUTEITEM_FAIL,
  payload: error,
})

export const getPattributeitemsFail = error => ({
  type: GET_PATTRIBUTEITEMS_FAIL,
  payload: error,
})


export const updatePattributeitem = pattributeitem => ({
  type: UPDATE_PATTRIBUTEITEM,
  payload: pattributeitem,
})

export const updatePattributeitemSuccess = pattributeitem => ({
  type: UPDATE_PATTRIBUTEITEM_SUCCESS,
  payload: pattributeitem,
})

export const updatePattributeitemFail = error => ({
  type: UPDATE_PATTRIBUTEITEM_FAIL,
  payload: error,
})

export const deletePattributeitem = pattributeitem => ({
  type: DELETE_PATTRIBUTEITEM,
  payload: pattributeitem,
})

export const deletePattributeitemSuccess = pattributeitem => ({
  type: DELETE_PATTRIBUTEITEM_SUCCESS,
  payload: pattributeitem,
})

export const deletePattributeitemFail = error => ({
  type: DELETE_PATTRIBUTEITEM_FAIL,
  payload: error,
})
