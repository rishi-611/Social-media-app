import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { logout } from "../../actions/auth";
import { clearProfile } from "../../actions/profile";

const Logout = ({ logout, clearProfile }) => {
  useEffect(() => {
    clearProfile();
    logout();
  }, []);

  return <Redirect to="/"></Redirect>;
};

export default connect(null, { logout, clearProfile })(Logout);
