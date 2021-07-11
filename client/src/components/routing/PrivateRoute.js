import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

// PrivateRoute will be used for all protected routes.
// it checks if authenticated, then renders the component
// otherwise redirectst to loginpage

const PrivateRoute = (props) => {
  if (!props.auth.authenticated && !props.auth.loading) {
    return <Redirect to="login" />;
  } else {
    return <Route exact path={props.path} component={props.component} />;
  }
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
