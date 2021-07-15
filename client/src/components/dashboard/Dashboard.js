import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import getProfile, { clearProfile } from "../../actions/profile";
import { Link } from "react-router-dom";
import DashboardActions from "./DashboardActions";
import Education from "./Education";
import Experience from "./Experience";
import { deleteAccount } from "../../actions/auth";

const Dashboard = ({
  profile,
  getProfile,
  clearProfile,
  auth,
  deleteAccount,
  history,
}) => {
  useEffect(() => {
    getProfile();

    return () => clearProfile();
  }, []);
  if (profile.loading && profile.profile === null) {
    return <Spinner />;
  }

  const handleDeleteAccBtn = () => {
    const msg =
      "Delete your account permanently? This action can not be undone?";
    if (window.confirm(msg)) deleteAccount(history);
  };

  return (
    <Fragment>
      <h1 className="large">Dashboard</h1>
      <p className="lead">
        Welcome {auth.user && <Fragment>{auth.user.name}</Fragment>}
      </p>
      {profile.profile ? (
        <Fragment>
          <DashboardActions userId={auth.user?._id ? auth.user._id : null} />
          {profile.profile && profile.profile?.experience?.length > 0 ? (
            <Experience experience={profile.profile.experience} />
          ) : null}
          {profile.profile && profile.profile?.education?.length > 0 ? (
            <Education education={profile.profile.education} />
          ) : null}
        </Fragment>
      ) : (
        <Fragment>
          <p>Create your profile so that people can know about you</p>
          <Link to="/profileForm">
            <button className="btn btn-primary my-1">Create Profile</button>
          </Link>
        </Fragment>
      )}
      <div className="my-2">
        <button className="btn btn-danger" onClick={handleDeleteAccBtn}>
          Delete Account
        </button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getProfile,
  deleteAccount,
  clearProfile,
})(Dashboard);
