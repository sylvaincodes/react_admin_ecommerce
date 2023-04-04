
import { GET_PVARIATIONS_SUCCESS,GET_PVARIATIONS_FAIL , 
  ADD_PVARIATION_SUCCESS,
  ADD_PVARIATION_FAIL,
  UPDATE_PVARIATION_SUCCESS,
  UPDATE_PVARIATION_FAIL,
  DELETE_PVARIATION_SUCCESS,
  DELETE_PVARIATION_FAIL,
  SET_PVARIATION_SUCCESS,
 } from "./actionTypes";
const INIT_STATE = {
    pvariations: [],
    pvariation: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const pvariations = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PVARIATIONS_SUCCESS:
        return {
          ...state,
          pvariations: action.payload,
        };
  
      case GET_PVARIATIONS_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_PVARIATION_SUCCESS:
  
        return {
          ...state,
          pvariations: [...state.pvariations, action.payload],
        };
  
      case ADD_PVARIATION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_PVARIATION_SUCCESS:
          return {
            ...state,
            pvariations: state.pvariations.map(pvariation =>
              pvariation.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : pvariation
            ),
          };
    
        case UPDATE_PVARIATION_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_PVARIATION_SUCCESS:
          return {
            ...state,
            pvariations: state.pvariations.filter(
              pvariation => pvariation.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_PVARIATION_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          case SET_PVARIATION_SUCCESS:
            return {
              ...state,
              pvariation: action.payload,
            };

        default:
            return state;
        }
      };


      export default pvariations;
