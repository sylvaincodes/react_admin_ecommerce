import {  } from "react-router-dom";

// Authentification
import Login from "../pages/authentification/Login";
import Register from "../pages/authentification/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import eDashboard from "../pages/ecommerce/Dashboard";
import ListUsers from "../pages/utilisateurs/ListUsers";
import ListCategories from "../pages/ecommerce/Categories/ListCategories";
import GridProducts from "../pages/ecommerce/Products/GridProducts";
import TableProducts from "../pages/ecommerce/Products/TableProducts";
import ListSlides from "../pages/parametres/Slides/ListSlides";
import ListSlidesItems from "../pages/parametres/Slides Items/ListSlidesItems";
import ListBrands from "../pages/ecommerce/Brands/ListBrands";
import ListCollections from "../pages/ecommerce/Collections/ListCollections";
import ListProducts from "../pages/ecommerce/Products/ListProducts";

//Public routes
const publicRoutes = [{ path: "/login", component: Login } , { path: "/register", component: Register }  ];

const authProtectedRoutes =  [
    { path: "/", component: Dashboard },
    { path: "/users/list", component: ListUsers },
    { path: "/ecommerce/dashboard", component: eDashboard },
    { path: "/ecommerce/categories", component: ListCategories },
    { path: "/ecommerce/produits", component: ListProducts },
    { path: "/ecommerce/brands", component: ListBrands },
    { path: "/ecommerce/produits/table", component: TableProducts },
    { path: "/parametres/slides/list", component: ListSlides },
    { path: "/parametres/slides/items/list", component: ListSlidesItems },
    { path: "/ecommerce/collections", component: ListCollections },
];

export { publicRoutes, authProtectedRoutes }