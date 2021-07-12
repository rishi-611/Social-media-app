import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import getProfile from "../../actions/profile";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Education from "./Education";
import Experience from "./Experience";

const Dashboard = ({ profile, getProfile, auth }) => {
  useEffect(() => {
    getProfile();
  }, []);
  if (profile.loading && profile.profile === null) {
    return <Spinner />;
  }
  return (
    <Fragment>
      <h1 className="large">Dashboard</h1>
      <p className="lead">
        Welcome {auth.user && <Fragment>{auth.user.name}</Fragment>}
      </p>
      {profile.profile ? (
        <Fragment>
          <DashboardActions />
          {profile.profile ? (
            <Experience experience={profile.profile.experience} />
          ) : null}
          {profile.profile ? (
            <Education education={profile.profile.education} />
          ) : null}
        </Fragment>
      ) : (
        <Fragment>
          <h2>You don't have a profile right now</h2>
          <p>Create your profile so that people can know about you</p>
          <Link to="/profileForm">
            <button className="btn btn-primary">Create Profile</button>
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile })(Dashboard);
