import { connect } from "react-redux";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ auth }) => {
  const renderGuestLinks = () => {
    return (
      <ul>
        <li>
          <Link to="/profiles" title="Profiles">
            <i class="fas fa-solid fa-user"></i>
            <span className="hide-sm mx">Profiles</span>
          </Link>
        </li>
        <li>
          <Link to="/register" title="Register">
            <i class="fas fa-solid fa-user-plus"></i>
            <span className="hide-sm mx">Register</span>
          </Link>
        </li>
        <li>
          <Link to="/login" title="Login">
            <i class="fas fa-solid fa-power-off"></i>
            <span className="hide-sm mx">Login</span>
          </Link>
        </li>
      </ul>
    );
  };

  const renderAuthLinks = () => {
    return (
      <ul>
        <li>
          <Link to="/profiles" title="profiles">
            <i class="fas fa-solid fa-user"></i>
            <span className="hide-sm mx">Profiles</span>
          </Link>
        </li>
        <li>
          <Link to="/Posts" title="posts">
            <i class="fas fa-solid fa-blog"></i>
            <span className="hide-sm mx">Posts</span>
          </Link>
        </li>
        <li>
          <Link to="/dashboard" title="dashboard">
            <i class="fas fa-solid fa-address-card"></i>
            <span className="hide-sm mx">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/logout" title="logout">
            <i class="fas fa-solid fa-power-off"></i>
            <span className="hide-sm mx">Logout</span>
          </Link>
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
