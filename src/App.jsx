import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Import all aroutes here
import { publicRoutes,authProtectedRoutes } from './routes'
import Authmiddleware from './routes/route';

// import css
import './assets/scss/style.scss';

import { API_URL, token } from './data';

import { useDispatch } from "react-redux";
import { getCategoriesSuccess } from "./redux/categories/actions";
import { getBrandsSuccess } from "./redux/brands/actions";
import { getCollectionsSuccess } from "./redux/collections/actions";


const App = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(API_URL + "/brands", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getBrandsSuccess(array));
      });
  }, []);  
  


  useEffect(() => {
    fetch(API_URL + "/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getCategoriesSuccess(array));
      });
  }, []);  

  useEffect(() => {
    fetch(API_URL + "/collections", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((array) => {
        dispatch(getCollectionsSuccess(array));
      });
  }, []);  
  


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