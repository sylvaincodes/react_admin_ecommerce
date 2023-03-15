import {
  GET_SLIDESITEMS,
  GET_SLIDESITEMS_FAIL,
  GET_SLIDESITEMS_SUCCESS,
  ADD_NEW_SLIDESITEM,
  ADD_SLIDESITEM_SUCCESS,
  ADD_SLIDESITEM_FAIL,
  UPDATE_SLIDESITEM,
  UPDATE_SLIDESITEM_SUCCESS,
  UPDATE_SLIDESITEM_FAIL,
  DELETE_SLIDESITEM,
  DELETE_SLIDESITEM_SUCCESS,
  DELETE_SLIDESITEM_FAIL,
} from "./actionTypes"

export const getSlidesitems = () => ({
  type: GET_SLIDESITEMS,
})

export const getSlidesitemsSuccess = categories => ({
  type: GET_SLIDESITEMS_SUCCESS,
  payload: categories,
})

export const addNewSlidesitem = category => ({
  type: ADD_NEW_SLIDESITEM,
  payload: category,
})

export const addSlidesitemSuccess = category => ({
  type: ADD_SLIDESITEM_SUCCESS,
  payload: category,
})

export const addSlidesitemFail = error => ({
  type: ADD_SLIDESITEM_FAIL,
  payload: error,
})

export const getSlidesitemsFail = error => ({
  type: GET_SLIDESITEMS_FAIL,
  payload: error,
})


export const updateSlidesitem = category => ({
  type: UPDATE_SLIDESITEM,
  payload: category,
})

export const updateSlidesitemSuccess = category => ({
  type: UPDATE_SLIDESITEM_SUCCESS,
  payload: category,
})

export const updateSlidesitemFail = error => ({
  type: UPDATE_SLIDESITEM_FAIL,
  payload: error,
})

export const deleteSlidesitem = category => ({
  type: DELETE_SLIDESITEM,
  payload: category,
})

export const deleteSlidesitemSuccess = category => ({
  type: DELETE_SLIDESITEM_SUCCESS,
  payload: category,
})

export const deleteSlidesitemFail = error => ({
  type: DELETE_SLIDESITEM_FAIL,
  payload: error,
})
