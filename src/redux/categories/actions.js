import {
  GET_CATEGORIES,
  GET_CATEGORIES_FAIL,
  GET_CATEGORIES_SUCCESS,
  ADD_NEW_CATEGORY,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  UPDATE_CATEGORY,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  DELETE_CATEGORY,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
} from "./actionTypes"

export const getCategories = () => ({
  type: GET_CATEGORIES,
})

export const getCategoriesSuccess = categories => ({
  type: GET_CATEGORIES_SUCCESS,
  payload: categories,
})

export const addNewCategory = category => ({
  type: ADD_NEW_CATEGORY,
  payload: category,
})

export const addCategorySuccess = category => ({
  type: ADD_CATEGORY_SUCCESS,
  payload: category,
})

export const addCategoryFail = error => ({
  type: ADD_CATEGORY_FAIL,
  payload: error,
})

export const getCategorysFail = error => ({
  type: GET_CATEGORIES_FAIL,
  payload: error,
})


export const updateCategory = category => ({
  type: UPDATE_CATEGORY,
  payload: category,
})

export const updateCategorySuccess = category => ({
  type: UPDATE_CATEGORY_SUCCESS,
  payload: category,
})

export const updateCategoryFail = error => ({
  type: UPDATE_CATEGORY_FAIL,
  payload: error,
})

export const deleteCategory = category => ({
  type: DELETE_CATEGORY,
  payload: category,
})

export const deleteCategorySuccess = category => ({
  type: DELETE_CATEGORY_SUCCESS,
  payload: category,
})

export const deleteCategoryFail = error => ({
  type: DELETE_CATEGORY_FAIL,
  payload: error,
})
