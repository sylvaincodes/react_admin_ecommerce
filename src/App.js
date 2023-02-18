import React from 'react'
import { Switch, BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Import all aroutes here
import { publicRoutes } from './routes'

// import css
import './assets/scss/style.scss';

const App = () => {
  return (
     <React.Fragment>
        <Router>
          <Routes>
            {
              publicRoutes.map( (route ,key) => (
                <Route key={key}  path={route.path} element={<route.component/>} />
             ))
            }
          </Routes>
        </Router>
     </React.Fragment>
  )
}


export default App;