import {
  GET_COLLECTIONS,
  GET_COLLECTIONS_FAIL,
  GET_COLLECTIONS_SUCCESS,
  ADD_NEW_COLLECTION,
  ADD_COLLECTION_SUCCESS,
  ADD_COLLECTION_FAIL,
  UPDATE_COLLECTION,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAIL,
  DELETE_COLLECTION,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAIL,
} from "./actionTypes"

export const getCollections = () => ({
  type: GET_COLLECTIONS,
})

export const getCollectionsSuccess = brands => ({
  type: GET_COLLECTIONS_SUCCESS,
  payload: brands,
})

export const addNewCollection = brand => ({
  type: ADD_NEW_COLLECTION,
  payload: brand,
})

export const addCollectionSuccess = brand => ({
  type: ADD_COLLECTION_SUCCESS,
  payload: brand,
})

export const addCollectionFail = error => ({
  type: ADD_COLLECTION_FAIL,
  payload: error,
})

export const getCollectionsFail = error => ({
  type: GET_COLLECTIONS_FAIL,
  payload: error,
})


export const updateCollection = brand => ({
  type: UPDATE_COLLECTION,
  payload: brand,
})

export const updateCollectionSuccess = brand => ({
  type: UPDATE_COLLECTION_SUCCESS,
  payload: brand,
})

export const updateCollectionFail = error => ({
  type: UPDATE_COLLECTION_FAIL,
  payload: error,
})

export const deleteCollection = brand => ({
  type: DELETE_COLLECTION,
  payload: brand,
})

export const deleteCollectionSuccess = brand => ({
  type: DELETE_COLLECTION_SUCCESS,
  payload: brand,
})

export const deleteCollectionFail = error => ({
  type: DELETE_COLLECTION_FAIL,
  payload: error,
})
