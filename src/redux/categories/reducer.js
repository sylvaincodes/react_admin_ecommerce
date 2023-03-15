
import { GET_CATEGORIES_SUCCESS,GET_CATEGORIES_FAIL , 
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAIL,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    categories: [],
    categorie: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const categories = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_CATEGORIES_SUCCESS:
        return {
          ...state,
          categories: action.payload,
        };
  
      case GET_CATEGORIES_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_CATEGORY_SUCCESS:
  
        return {
          ...state,
          categories: [...state.categories, action.payload],
        };
  
      case ADD_CATEGORY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_CATEGORY_SUCCESS:
          return {
            ...state,
            categories: state.categories.map(categorie =>
              categorie.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : categorie
            ),
          };
    
        case UPDATE_CATEGORY_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_CATEGORY_SUCCESS:
          return {
            ...state,
            categories: state.categories.filter(
              categorie => categorie.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_CATEGORY_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default categories;
