import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alerts";
import register from "../../actions/auth";

const Register = ({ setAlert, register, authorized }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setAlert("danger", "Passwords must match");
      return console.log("failure. passwords should match");
    }

    const formToSubmit = { ...formData };
    delete formToSubmit.password2;
    register(formToSubmit);
  };

  // redirect if authorized
  if (authorized) {
    return <Redirect to="/dashboard"></Redirect>;
  }

  return (
    <React.Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            required
            onChange={(e) => onChange(e)}
            autoComplete="username"
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={formData.password}
            onChange={(e) => onChange(e)}
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={formData.password2}
            onChange={(e) => onChange(e)}
            autoComplete="new-password"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  authorized: state.auth.authenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
