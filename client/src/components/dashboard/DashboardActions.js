import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="centered-container">
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
