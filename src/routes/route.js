import React from "react"
import PropTypes from "prop-types"
import { Navigate, Outlet } from "react-router-dom"
import VerticalLayout from "../layouts/vertical/Index"

const Authmiddleware = ({ component: Component, ...rest }) => {
  
  return localStorage.getItem("user") ? 
  <VerticalLayout>
    <Outlet />
  </VerticalLayout>
  
  : <Navigate to="/login" />;
  
}

  // Add your own authentication on the below line.
  // const isLoggedIn = AuthService.isLoggedIn()

  // return (
  //   <Route
  //     {...rest}
  //     render=
      
  //     {
  //       props =>
  //       {

  //         return localStorage.getItem("authUser") ? 
  //         (
  //           <Component {...props} />
  //           ) : 
  //           (
  //             <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
  //             )
  //           }
  //         }
  //   />
  // )


// const Authmiddleware = ({
//   component: Component,
//   layout: Layout,
//   isAuthProtected,
//   ...rest
// }) => (
//   <Route
//     {...rest}
//     render={props => {
//       if (isAuthProtected && !localStorage.getItem("authUser")) {
//         return (
//           <Redirect
//             to={{ pathname: "/login", state: { from: props.location } }}
//           />
//         )
//       }
//       return (
//         <Layout>
//           <Component {...props} />
//         </Layout>
//       )
//     }}
//   />
// )



// const Authmiddleware = ({ component , path }) =>{
//   return (
//         <Route  path={path} element={<component/>} />
//   );
// }

Authmiddleware.propTypes = {
  // isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  // location: PropTypes.object,
  // layout: PropTypes.any, 
}

export default Authmiddleware;
