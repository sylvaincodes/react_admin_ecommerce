
import { GET_PATTRIBUTEITEMS_SUCCESS,GET_PATTRIBUTEITEMS_FAIL , 
  ADD_PATTRIBUTEITEM_SUCCESS,
  ADD_PATTRIBUTEITEM_FAIL,
  UPDATE_PATTRIBUTEITEM_SUCCESS,
  UPDATE_PATTRIBUTEITEM_FAIL,
  DELETE_PATTRIBUTEITEM_SUCCESS,
  DELETE_PATTRIBUTEITEM_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    pattributeitems: [],
    pattributeitem: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const pattributeitems = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PATTRIBUTEITEMS_SUCCESS:
        return {
          ...state,
          pattributeitems: action.payload,
        };
  
      case GET_PATTRIBUTEITEMS_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_PATTRIBUTEITEM_SUCCESS:
  
        return {
          ...state,
          pattributeitems: [...state.pattributeitems, action.payload],
        };
  
      case ADD_PATTRIBUTEITEM_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_PATTRIBUTEITEM_SUCCESS:
          return {
            ...state,
            pattributeitems: state.pattributeitems.map(pattributeitem =>
              pattributeitem.id.toString() === action.payload.id.toString()
                ?  action.payload 
                : pattributeitem
            ),
          };
    
        case UPDATE_PATTRIBUTEITEM_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_PATTRIBUTEITEM_SUCCESS:
          return {
            ...state,
            pattributeitems: state.pattributeitems.filter(
              pattributeitem => pattributeitem.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_PATTRIBUTEITEM_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default pattributeitems;
