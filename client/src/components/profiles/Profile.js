import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import {
  getProfileById,
  getGithubRepos,
  clearProfile,
} from "../../actions/profile";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import Moment from "react-moment";
import { Redirect, Link } from "react-router-dom";

const ProfileItem = ({
  match,
  profile,
  getProfileById,
  clearProfile,
  getGithubRepos,
  error,
  repos,
  user,
}) => {
  useEffect(() => {
    // on component unmount, clean up the profile from state
    // otherwise will cause error in loading a profile if the state already has a profile
    return () => clearProfile();
  }, []);

  useEffect(() => {
    if (!profile) {
      getProfileById(match.params.id);
    }
    if (profile?.githubusername) {
      getGithubRepos(profile.githubusername);
    }
  }, [profile]);

  // show only those links which are provided by user
  const renderSocialLinks = () => (
    <Fragment>
      {profile.website ? (
        <a
          key="website-logo"
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className={`fas fa-globe fa-2x`}></i>
        </a>
      ) : null}
      {Object.keys(profile.social).map((field, i) =>
        profile.social[field] ? (
          <a
            key={i}
            href={profile.social[field]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`fab fa-${field} fa-2x`}></i>
          </a>
        ) : null
      )}
    </Fragment>
  );
  const renderSkills = () =>
    profile.skills.map((skill, i) => (
      <div className="p-1" key={`skill-${i}`}>
        <i className="fa fa-check"></i> {skill}
      </div>
    ));

  const renderExperience = () =>
    profile.experience.map((exp) => (
      <div key={exp._id}>
        <h3 className="text-dark">
          {exp.title} at {exp.company}
        </h3>
        {exp.location ? <p>{exp.location}</p> : null}
        <p>
          {" "}
          <Moment format="DD/MM/YYYY">{exp.from}</Moment> -{" "}
          {exp.current ? "now" : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong>
          {exp.title}
        </p>
        {exp.description ? (
          <Fragment>
            {" "}
            <p>
              <strong>Description: </strong>
              {exp.description}
            </p>
          </Fragment>
        ) : null}
      </div>
    ));

  const renderEducation = () =>
    profile.education.map((educ) => (
      <div key={educ._id}>
        <h3>{educ.school}</h3>
        <p>
          {" "}
          <Moment format="DD/MM/YYYY">{educ.from}</Moment> -{" "}
          {educ.current ? (
            "now"
          ) : (
            <Moment format="DD/MM/YYYY">{educ.to}</Moment>
          )}
        </p>
        <p>
          <strong>Degree: </strong>
          {educ.degree}
        </p>
        {educ.fieldofstudy ? (
          <p>
            <strong>Field Of Study: </strong>
            {educ.fieldofstudy}
          </p>
        ) : null}
        {educ.description ? (
          <p>
            <strong>Description: </strong>
            {educ.description}
          </p>
        ) : null}
      </div>
    ));

  const renderRepos = () =>
    repos.map((repo) => (
      <div className="repo bg-white p-1 my-1" key={repo.id}>
        <div>
          <h4>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a>
          </h4>
          {repo.description ? <p>{repo.description}</p> : null}
        </div>
        <div>
          <ul>
            <li className="badge badge-primary">
              Stars: {repo.stargazers_count}
            </li>
            <li className="badge badge-dark">Watchers: {repo.watchers}</li>
            <li className="badge badge-light">Forks: {repo.forks_count}</li>
          </ul>
        </div>
      </div>
    ));

  if (!profile && !error) {
    return <Spinner />;
  }

  if (!profile && error && Object.keys(error).length === 0) {
    return <Spinner />;
  }

  if (!profile && error && Object.keys(error).length > 0) {
    return <Redirect to="/profiles"></Redirect>;
  }

  if (!profile) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Link to="/profiles" className="btn btn-dark btn-sm-block">
        Back To Profiles
      </Link>

      {user?._id === profile.user._id ? (
        <Link to="/profileForm" className="btn btn-dark mx btn-sm-block">
          Edit Profile
        </Link>
      ) : null}

      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          <img
            className="round-img my-1"
            src={profile.user.avatar}
            alt="user avatar"
          />
          <h1 className="large">{profile.user.name}</h1>
          <p className="lead">
            {profile.status} {profile.company ? `at ${profile.company}` : ""}
          </p>
          {profile.location ? <p>{profile.location}</p> : null}
          {profile.social ? (
            <div className="icons my-1">{renderSocialLinks()}</div>
          ) : null}
        </div>

        <div className="profile-about bg-light p-2">
          {profile.bio ? (
            <Fragment>
              <h2 className="text-primary">
                {profile.user.name.split(" ")[0]} 's Bio
              </h2>
              <p>{profile.bio}</p>
            </Fragment>
          ) : null}

          <div className="line"></div>
          <h2 className="text-primary">Skill Set</h2>
          <div className="skills">{renderSkills()}</div>
        </div>

        <div className="profile-exp bg-white p-2">
          <h2 className="text-primary">Experience</h2>
          {profile.experience.length === 0 ? (
            <p>No experience credentials</p>
          ) : (
            renderExperience()
          )}
        </div>

        <div className="profile-edu bg-white p-2">
          <h2 className="text-primary">Education</h2>
          {profile.education.length === 0
            ? "No education credentials"
            : renderEducation()}
        </div>

        <div className="profile-github">
          <h2 className="text-primary my-1">
            <i className="fab fa-github"></i> Github Repos
          </h2>
          {repos?.length === 0
            ? `${profile.user.name} doesn't have any repos`
            : renderRepos()}
        </div>
      </div>
    </Fragment>
  );
};

ProfileItem.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  error: state.profile.error,
  repos: state.profile.repos,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  getProfileById,
  getGithubRepos,
  clearProfile,
})(ProfileItem);
