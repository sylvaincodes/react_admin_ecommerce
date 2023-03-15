
import { 
  GET_SLIDESITEMS_SUCCESS,
  GET_SLIDESITEMS_FAIL , 
  ADD_SLIDESITEM_SUCCESS,
  ADD_SLIDESITEM_FAIL,
  UPDATE_SLIDESITEM_SUCCESS,
  UPDATE_SLIDESITEM_FAIL,
  DELETE_SLIDESITEM_SUCCESS,
  DELETE_SLIDESITEM_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    slidesitems: [],
    slidesitem: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const slidesitems = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_SLIDESITEMS_SUCCESS:
        return {
          ...state,
          slidesitems: action.payload,
        };
  
      case GET_SLIDESITEMS_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        
      case ADD_SLIDESITEM_SUCCESS:
  
        return {
          ...state,
          slidesitems: [...state.slidesitems, action.payload],
        };
  
      case ADD_SLIDESITEM_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
        case UPDATE_SLIDESITEM_SUCCESS:
          return {
            ...state,
            slidesitems: state.slidesitems.map(slide =>
              slide.id.toString() === action.payload.id.toString()
                ? action.payload 
                : slide
            ),
          };
    
        case UPDATE_SLIDESITEM_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_SLIDESITEM_SUCCESS:
          return {
            ...state,
            slidesitems: state.slidesitems.filter(
              slide => slide.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_SLIDESITEM_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default slidesitems;
