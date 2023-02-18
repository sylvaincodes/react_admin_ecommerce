import React, { Component } from "react";
import { Route } from "react-router-dom";
import PropTypes from 'prop-types';

const routes = ({ component: Component, layout: Layout , ...rest  }) => (
  <Route 
    { ...rest}
    render={ routeProps => {
      return (
        <Layout>
          <Component {...routeProps} />
        </Layout>
      );
    }}
  />
);

routes.PropTypes = {
  component : PropTypes.any,
  layout : PropTypes.any
}

export default routes;
