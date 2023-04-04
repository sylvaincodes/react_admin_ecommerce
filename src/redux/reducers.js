import { combineReducers } from "redux";


// reducer
import login from "./auth/login/reducer";
import users from "./users/reducer";
import products from "./products/reducer";
import categories from "./categories/reducer"
import slides from './slides/reducer'
import slidesitems from './slidesitems/reducer'
import brands from "./brands/reducer";
import collections from "./collections/reducer"
import pattributes from "./pattributes/reducer";
import pattributeitems from "./pattributeitems/reducer";
import pvariations
 from "./pvariations/reducer";
import pvariationattributes from './pvariationattributes/reducer'

const rootReducer = combineReducers(
  {
    login,
    users,
    products,
    categories,
    slides,
    slidesitems,
    brands,
    collections,
    pattributes,
    pattributeitems,
    pvariations,
    pvariationattributes,
  },

);

export default rootReducer;
