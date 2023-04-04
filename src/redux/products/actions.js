import {
  GET_PRODUCTS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  ADD_NEW_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  SET_PRODUCT_SUCCESS
} from "./actionTypes.js";

export const getProducts = () => ({
    type: GET_PRODUCTS,
  })
  
  export const getProductsSuccess = products => ({
    type: GET_PRODUCTS_SUCCESS,
    payload: products,
  })
  
  export const getProductsFail = error => ({
    type: GET_PRODUCTS_FAIL,
    payload: error,
})


export const addNewProduct = product => ({
  type: ADD_NEW_PRODUCT,
  payload: product,
})

export const addProductSuccess = product => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
})

export const addProductFail = error => ({
  type: ADD_PRODUCT_FAIL,
  payload: error,
})


export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  payload: product,
})

export const updateProductSuccess = product => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
})

export const updateProductFail = error => ({
  type: UPDATE_PRODUCT_FAIL,
  payload: error,
})

export const deleteProduct = product => ({
  type: DELETE_PRODUCT,
  payload: product,
})

export const deleteProductSuccess = product => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: product,
})

export const deleteProductFail = error => ({
  type: DELETE_PRODUCT_FAIL,
  payload: error,
})

export const setProductSuccess = product => ({
  type: SET_PRODUCT_SUCCESS,
  payload: product,
})

