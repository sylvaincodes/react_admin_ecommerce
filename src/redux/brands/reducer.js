
import { GET_BRANDS_SUCCESS,GET_BRANDS_FAIL , 
  ADD_BRAND_SUCCESS,
  ADD_BRAND_FAIL,
  UPDATE_BRAND_SUCCESS,
  UPDATE_BRAND_FAIL,
  DELETE_BRAND_SUCCESS,
  DELETE_BRAND_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    brands: [],
    brand: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const brands = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_BRANDS_SUCCESS:
        return {
          ...state,
          brands: action.payload,
        };
  
      case GET_BRANDS_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_BRAND_SUCCESS:
  
        return {
          ...state,
          brands: [...state.brands, action.payload],
        };
  
      case ADD_BRAND_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_BRAND_SUCCESS:
          return {
            ...state,
            brands: state.brands.map(brand =>
              brand.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : brand
            ),
          };
    
        case UPDATE_BRAND_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_BRAND_SUCCESS:
          return {
            ...state,
            brands: state.brands.filter(
              brand => brand.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_BRAND_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default brands;
