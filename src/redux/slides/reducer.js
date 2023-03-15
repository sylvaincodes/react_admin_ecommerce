
import { 
  GET_SLIDES_SUCCESS,
  GET_SLIDES_FAIL , 
  ADD_SLIDE_SUCCESS,
  ADD_SLIDE_FAIL,
  UPDATE_SLIDE_SUCCESS,
  UPDATE_SLIDE_FAIL,
  DELETE_SLIDE_SUCCESS,
  DELETE_SLIDE_FAIL,
 } from "./actionTypes";
const INIT_STATE = {
    slides: [],
    slide: {},
    total_page :"",
    current_page:"1",
    error: {},
    loading :false
  };


  const slides = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_SLIDES_SUCCESS:
        return {
          ...state,
          slides: action.payload,
        };
  
      case GET_SLIDES_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        

      case ADD_SLIDE_SUCCESS:
  
        return {
          ...state,
          slides: [...state.slides, action.payload],
        };
  
      case ADD_SLIDE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
   
  
        case UPDATE_SLIDE_SUCCESS:
          return {
            ...state,
            slides: state.slides.map(slide =>
              slide.id.toString() === action.payload.id.toString()
                ? { slide, ...action.payload }
                : slide
            ),
          };
    
        case UPDATE_SLIDE_FAIL:
          return {
            ...state,
            error: action.payload,
          }
    
        case DELETE_SLIDE_SUCCESS:
          return {
            ...state,
            slides: state.slides.filter(
              slide => slide.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_SLIDE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        default:
            return state;
        }
      };


      export default slides;
