
import { GET_PRODUCTS_SUCCESS,GET_PRODUCTS_FAIL } from "./actionTypes";
const INIT_STATE = {
    products: [],
    product: {},
    total_page :""
  };


  const products = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PRODUCTS_SUCCESS:
        return {
          ...state,
          products: action.payload.data,
          total_page : action.payload.last_page
        };
  
      case GET_PRODUCTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

        default:
            return state;
        }
      };


      export default products;
