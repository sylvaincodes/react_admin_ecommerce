import React from 'react'
import { redirect } from "react-router-dom";

// Authentification
import Login from "../pages/authentification/Login";
import Register from "../pages/authentification/Register";

// Public routes
const publicRoutes = [{ path: "/login", component: Login } , { path: "/register", component: Register }  ];


export { publicRoutes }