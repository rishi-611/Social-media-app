import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ auth }) => {
  const renderGuestLinks = () => {
    return (
      <ul>
        <li>
          <Link to="/profiles">Profiles</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    );
  };

  const renderAuthLinks = () => {
    return (
      <ul>
        <li>
          <Link to="/profiles">Profiles</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    );
  };
  return (
    <React.Fragment>
      <nav className="navbar bg-dark">
        <h3>
          <Link to="/">
            <i className="fas fa-laptop-code"></i> TechConnect
          </Link>
        </h3>
        {!auth.loading && (
          <React.Fragment>
            {auth.authenticated === true
              ? renderAuthLinks()
              : renderGuestLinks()}
          </React.Fragment>
        )}
      </nav>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Navbar);
