import { combineReducers } from "redux";

// Authentification
import login from "./auth/login/reducer";

const rootReducer = combineReducers({
    login
})

export default rootReducer;