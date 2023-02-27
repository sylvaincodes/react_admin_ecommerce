import {
  GET_PRODUCTS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
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