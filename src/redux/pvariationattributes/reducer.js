
import { GET_PVARIATIONATTRIBUTES_SUCCESS,GET_PVARIATIONATTRIBUTES_FAIL , 
  ADD_PVARIATIONATTRIBUTE_SUCCESS,
  ADD_PVARIATIONATTRIBUTE_FAIL,
  UPDATE_PVARIATIONATTRIBUTE_SUCCESS,
  UPDATE_PVARIATIONATTRIBUTE_FAIL,
  DELETE_PVARIATIONATTRIBUTE_SUCCESS,
  DELETE_PVARIATIONATTRIBUTE_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    pvariationattributes: [],
    pvariationattribute: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const pvariationattributes = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PVARIATIONATTRIBUTES_SUCCESS:
        return {
          ...state,
          pvariationattributes: action.payload,
        };
  
      case GET_PVARIATIONATTRIBUTES_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_PVARIATIONATTRIBUTE_SUCCESS:
  
        return {
          ...state,
          pvariationattributes: [...state.pvariationattributes, action.payload],
        };
  
      case ADD_PVARIATIONATTRIBUTE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_PVARIATIONATTRIBUTE_SUCCESS:
          return {
            ...state,
            pvariationattributes: state.pvariationattributes.map(pvariationattribute =>
              pvariationattribute.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : pvariationattribute
            ),
          };
    
        case UPDATE_PVARIATIONATTRIBUTE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_PVARIATIONATTRIBUTE_SUCCESS:
          return {
            ...state,
            pvariationattributes: state.pvariationattributes.filter(
              pvariationattribute => pvariationattribute.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_PVARIATIONATTRIBUTE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default pvariationattributes;
