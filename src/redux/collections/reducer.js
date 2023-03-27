
import { GET_COLLECTIONS_SUCCESS,GET_COLLECTIONS_FAIL , 
  ADD_COLLECTION_SUCCESS,
  ADD_COLLECTION_FAIL,
  UPDATE_COLLECTION_SUCCESS,
  UPDATE_COLLECTION_FAIL,
  DELETE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    collections: [],
    collection: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const collections = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_COLLECTIONS_SUCCESS:
        return {
          ...state,
          collections: action.payload,
        };
  
      case GET_COLLECTIONS_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_COLLECTION_SUCCESS:
  
        return {
          ...state,
          collections: [...state.collections, action.payload],
        };
  
      case ADD_COLLECTION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_COLLECTION_SUCCESS:
          return {
            ...state,
            collections: state.collections.map(collection =>
              collection.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : collection
            ),
          };
    
        case UPDATE_COLLECTION_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_COLLECTION_SUCCESS:
          return {
            ...state,
            collections: state.collections.filter(
              collection => collection.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_COLLECTION_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default collections;
