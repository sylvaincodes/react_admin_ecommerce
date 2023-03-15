import { combineReducers } from "redux";


// reducer
import login from "./auth/login/reducer";
import users from "./users/reducer";
import products from "./products/reducer";
import categories from "./categories/reducer"
import slides from './slides/reducer'
import slidesitems from './slidesitems/reducer'

const rootReducer = combineReducers(
  {
    login,
    users,
    products,
    categories,
    slides,
    slidesitems,
  },

);

export default rootReducer;
