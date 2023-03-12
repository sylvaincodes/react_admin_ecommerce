import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Import all aroutes here
import { publicRoutes,authProtectedRoutes } from './routes'
import Authmiddleware from './routes/route';

// import css
import './assets/scss/style.scss';

import { API_URL, token } from './data';

import { getProductsSuccess } from './redux/products/actions';
import { useDispatch } from "react-redux";
import { getCategoriesSuccess } from "./redux/categories/actions";


const App = () => {
  
    const dispatch = useDispatch()

    //Api get products
    const getProducts =  () => {
      fetch(API_URL + "/products", {
         headers: {
           Authorization: "Bearer " + token,
         },
       })
         .then((response) => response.json())
         .then((array) => {
           dispatch(getProductsSuccess(array));
         });
     };
     
     const getCategories =  () => {
      fetch(API_URL + "/categories", {
         headers: {
           Authorization: "Bearer " + token,
         },
       })
         .then((response) => response.json())
         .then((array) => {
           dispatch(getCategoriesSuccess(array));
         });
     };

     useEffect(() => {
      getProducts();
      getCategories();
     }, [])
     
  return (
     <React.Fragment>
        <Router>
          <Routes>

          <Route exact path='/' element={<Authmiddleware/>}>
            {
              authProtectedRoutes.map( (route ,key) => (
                <Route exact key={key}  path={route.path}  element={<route.component/>} />
             ))
            }
          </Route>

            {
              publicRoutes.map( (route ,key) => (

                // <Nolayout>

                <Route 
                  key={key}
                  path={route.path} element={<route.component/>}
                  />
                // </Nolayout>
             ))
            }
                      


          </Routes>
        </Router>
     </React.Fragment>
  )
}


export default App;