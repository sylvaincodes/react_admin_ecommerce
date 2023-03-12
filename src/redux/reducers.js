import { combineReducers } from "redux";


// reducer
import login from "./auth/login/reducer";
import users from "./users/reducer";
import products from "./products/reducer";
import categories from "./categories/reducer"

const rootReducer = combineReducers(
  {
    login,
    users,
    products,
    categories
  },

);

export default rootReducer;
