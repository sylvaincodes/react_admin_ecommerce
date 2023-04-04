import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Import all aroutes here
import { publicRoutes, authProtectedRoutes } from "./routes";
import Authmiddleware from "./routes/route";

// import css
import "./assets/scss/style.scss";

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route exact path="/" element={<Authmiddleware />}>
            {authProtectedRoutes.map((route, key) => (
              <Route
                exact
                key={key}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Route>

          {publicRoutes.map((route, key) => (
            // <Nolayout>

            <Route key={key} path={route.path} element={<route.component />} />
            // </Nolayout>
          ))}
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default App;
