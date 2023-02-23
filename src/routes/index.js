import {  } from "react-router-dom";

// Authentification
import Login from "../pages/authentification/Login";
import Register from "../pages/authentification/Register";
import Dashboard from "../pages/dashboard/Dashboard";


// Public routes
const publicRoutes = [{ path: "/login", component: Login } , { path: "/register", component: Register }  ];

const authProtectedRoutes =  [{ path: "/dashboard", component: Dashboard }];


export { publicRoutes, authProtectedRoutes }