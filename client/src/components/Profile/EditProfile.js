import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import getProfile, { createProfile } from "../../actions/profile";

const ProfileForm = ({
  createProfile,
  history,
  getProfile,
  profile: { profile, loading },
}) => {
  const [formData, setFormData] = useState({
    company: "",
    website: "",
    location: "",
    status: "",
    skills: "",
    bio: "",
    githubusername: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    instagram: "",
  });

  const [addSocialLinks, setAddSocialLinks] = useState(false);

  //   this will be triggered only when component mounts, or loading state changes
  // if the user has reached this page from some button click, the profile should already by loaded,
  // and profile state will already be there, so getProfile() will not have any effect on the component,
  // as getProfile() will never change loading, as loading is already false
  // But if user pastes the url and accesses this component directly, useEffect will fetch profile, and
  // loading will be then set to false, and then useEffect will be called again, and then formData will be set
  useEffect(() => {
    getProfile();

    setFormData({
      company: loading || !profile.website ? "" : profile.website,
      website: loading || !profile.website ? "" : profile.website,
      location: loading || !profile.location ? "" : profile.location,
      status: loading || !profile.status ? "" : profile.status,
      skills: loading || !profile.skills ? "" : profile.skills,
      bio: loading || !profile.bio ? "" : profile.bio,
      githubusername:
        loading || !profile.githubusername ? "" : profile.githubusername,
      youtube: loading || !profile.social ? "" : profile.social.youtube,
      twitter: loading || !profile.social ? "" : profile.social.twitter,
      linkedin: loading || !profile.social ? "" : profile.social.linkedin,
      facebook: loading || !profile.social ? "" : profile.social.facebook,
      instagram: loading || !profile.social ? "" : profile.social.instagram,
    });
  }, [loading]);

  const {
    skills,
    status,
    company,
    website,
    location,
    bio,
    githubusername,
    youtube,
    twitter,
    linkedin,
    facebook,
    instagram,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let cleanedFormData = {};
    Object.keys(formData).forEach((field) => {
      if (formData[field].length !== 0) {
        cleanedFormData[field] = formData[field];
      }
    });
    if (cleanedFormData.status === "0") {
      delete cleanedFormData.status;
    }
    console.log(cleanedFormData);
    // any component which is direct child of router, gets access to history object in props
    // we need to pass it to action, if we want to use it there
    // if profile already exists, then edit, otherwise set edit to false
    createProfile(cleanedFormData, history, false);
  };

  const handleSocialBtn = () => {
    setAddSocialLinks(!addSocialLinks);
  };

  const socialLinks = (
    <Fragment>
      <div className="form-group social-input">
        <i className="fab fa-twitter fa-2x"></i>
        <input
          type="text"
          placeholder="Twitter URL"
          name="twitter"
          onChange={(e) => onChange(e)}
          value={twitter}
        />
      </div>

      <div className="form-group social-input">
        <i className="fab fa-facebook fa-2x"></i>
        <input
          type="text"
          placeholder="Facebook URL"
          name="facebook"
          onChange={(e) => onChange(e)}
          value={facebook}
        />
      </div>

      <div className="form-group social-input">
        <i className="fab fa-youtube fa-2x"></i>
        <input
          type="text"
          placeholder="YouTube URL"
          name="youtube"
          onChange={(e) => onChange(e)}
          value={youtube}
        />
      </div>

      <div className="form-group social-input">
        <i className="fab fa-linkedin fa-2x"></i>
        <input
          type="text"
          placeholder="Linkedin URL"
          name="linkedin"
          onChange={(e) => onChange(e)}
          value={linkedin}
        />
      </div>

      <div className="form-group social-input">
        <i className="fab fa-instagram fa-2x"></i>
        <input
          type="text"
          placeholder="Instagram URL"
          name="instagram"
          onChange={(e) => onChange(e)}
          value={instagram}
        />
      </div>
    </Fragment>
  );
  return (
    <Fragment>
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <select
            name="status"
            onChange={(e) => onChange(e)}
            value={status}
            required
          >
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            onChange={(e) => onChange(e)}
            value={company}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            onChange={(e) => onChange(e)}
            value={website}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            onChange={(e) => onChange(e)}
            value={location}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            onChange={(e) => onChange(e)}
            value={skills}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            onChange={(e) => onChange(e)}
            value={githubusername}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            onChange={(e) => onChange(e)}
            value={bio}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={handleSocialBtn}
          >
            {addSocialLinks
              ? "Hide Social Network Links"
              : "Add Social Network Links"}
          </button>
          <span>Optional</span>
        </div>

        {addSocialLinks && socialLinks}

        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(null, {
  createProfile,
  getProfile,
})(ProfileForm);
