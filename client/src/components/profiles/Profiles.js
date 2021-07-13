import React, { Fragment, useEffect } from "react";
import { clearProfile, getAllProfiles } from "../../actions/profile";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";

const Profiles = ({ clearProfile, getAllProfiles, profile }) => {
  useEffect(() => {
    clearProfile();
    getAllProfiles();
  }, []);

  const renderProfileItems = () =>
    profile.profiles.map((profile) => (
      <li className="profile bg-light" key={profile._id}>
        <img
          className="round-img"
          src={profile.user.avatar}
          alt="User avatar"
        />
        <div>
          <h2>{profile.user.name}</h2>
          <p>
            {profile.status} {profile.company ? `at ${profile.company}` : ""}
          </p>
          <p>{profile.location && profile.location}</p>
          <Link
            to={`/profiles/${profile.user._id}`}
            className="btn btn-primary"
          >
            View Profile
          </Link>
        </div>

        <ul>
          {profile.skills.map((skill, index) => (
            <li className="text-primary" key={`skill-${index}`}>
              <i className="fas fa-check"></i> {skill}
            </li>
          ))}
        </ul>
      </li>
    ));

  if (profile.loading && profile.profiles.length === 0) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Browse and connect with
        developers
      </p>
      <ul className="profiles">{renderProfileItems()}</ul>
    </Fragment>
  );
};

Profiles.propTypes = {
  clearProfile: PropTypes.func.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { clearProfile, getAllProfiles })(
  Profiles
);
