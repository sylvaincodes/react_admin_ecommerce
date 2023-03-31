
import { GET_PATTRIBUTES_SUCCESS,GET_PATTRIBUTES_FAIL , 
  ADD_PATTRIBUTE_SUCCESS,
  ADD_PATTRIBUTE_FAIL,
  UPDATE_PATTRIBUTE_SUCCESS,
  UPDATE_PATTRIBUTE_FAIL,
  DELETE_PATTRIBUTE_SUCCESS,
  DELETE_PATTRIBUTE_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    pattributes: [],
    pattribute: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const pattributes = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PATTRIBUTES_SUCCESS:
        return {
          ...state,
          pattributes: action.payload,
        };
  
      case GET_PATTRIBUTES_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_PATTRIBUTE_SUCCESS:
  
        return {
          ...state,
          pattributes: [...state.pattributes, action.payload],
        };
  
      case ADD_PATTRIBUTE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_PATTRIBUTE_SUCCESS:
          return {
            ...state,
            pattributes: state.pattributes.map(pattribute =>
              pattribute.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : pattribute
            ),
          };
    
        case UPDATE_PATTRIBUTE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_PATTRIBUTE_SUCCESS:
          return {
            ...state,
            pattributes: state.pattributes.filter(
              pattribute => pattribute.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_PATTRIBUTE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default pattributes;
