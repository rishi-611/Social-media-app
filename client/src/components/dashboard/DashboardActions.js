import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = ({ userId }) => {
  return (
    <div className="centered-container">
      {userId ? (
        <Link to={`/profiles/${userId}`} className="btn btn-dark centered-btns">
          View Profile
        </Link>
      ) : null}
      <Link to="/profileForm" className="btn btn-dark centered-btns">
        Edit Profile
      </Link>
      <Link to="/addExperience" className="btn btn-dark centered-btns">
        Add Experience
      </Link>
      <Link to="/addEducation" className="btn btn-dark centered-btns">
        Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;
