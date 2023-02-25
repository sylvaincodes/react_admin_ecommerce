import { combineReducers } from "redux";

// Authentification
import login from "./auth/login/reducer";

import users from './users/reducer'

const rootReducer = combineReducers({
    login,
    users
})

export default rootReducer;