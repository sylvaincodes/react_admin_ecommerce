import {
  GET_SLIDES,
  GET_SLIDES_FAIL,
  GET_SLIDES_SUCCESS,
  ADD_NEW_SLIDE,
  ADD_SLIDE_SUCCESS,
  ADD_SLIDE_FAIL,
  UPDATE_SLIDE,
  UPDATE_SLIDE_SUCCESS,
  UPDATE_SLIDE_FAIL,
  DELETE_SLIDE,
  DELETE_SLIDE_SUCCESS,
  DELETE_SLIDE_FAIL,
} from "./actionTypes"

export const getSlides = () => ({
  type: GET_SLIDES,
})

export const getSlidesSuccess = categories => ({
  type: GET_SLIDES_SUCCESS,
  payload: categories,
})

export const addNewSlide = category => ({
  type: ADD_NEW_SLIDE,
  payload: category,
})

export const addSlideSuccess = category => ({
  type: ADD_SLIDE_SUCCESS,
  payload: category,
})

export const addSlideFail = error => ({
  type: ADD_SLIDE_FAIL,
  payload: error,
})

export const getSlidesFail = error => ({
  type: GET_SLIDES_FAIL,
  payload: error,
})


export const updateSlide = category => ({
  type: UPDATE_SLIDE,
  payload: category,
})

export const updateSlideSuccess = category => ({
  type: UPDATE_SLIDE_SUCCESS,
  payload: category,
})

export const updateSlideFail = error => ({
  type: UPDATE_SLIDE_FAIL,
  payload: error,
})

export const deleteSlide = category => ({
  type: DELETE_SLIDE,
  payload: category,
})

export const deleteSlideSuccess = category => ({
  type: DELETE_SLIDE_SUCCESS,
  payload: category,
})

export const deleteSlideFail = error => ({
  type: DELETE_SLIDE_FAIL,
  payload: error,
})
