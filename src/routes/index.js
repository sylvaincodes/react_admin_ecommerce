import {  } from "react-router-dom";

// Authentification
import Login from "../pages/authentification/Login";
import Register from "../pages/authentification/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import eDashboard from "../pages/ecommerce/Dashboard";
import ListUsers from "../pages/utilisateurs/ListUsers";
import ListProducts from "../pages/ecommerce/Products";

//Public routes
const publicRoutes = [{ path: "/login", component: Login } , { path: "/register", component: Register }  ];

const authProtectedRoutes =  [
    { path: "/dashboard", component: Dashboard },
    { path: "/ecommerce/dashboard", component: eDashboard },
    { path: "/users/list", component: ListUsers },
    { path: "/ecommerce/produits", component: ListProducts }
];

export { publicRoutes, authProtectedRoutes }