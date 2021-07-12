import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div>
      <Link to="/profileForm" className="btn btn-light">
        Edit Profile
      </Link>
      <Link to="/addExperience" className="btn btn-light">
        Add Experience
      </Link>
      <Link to="/addEducation" className="btn btn-light">
        Add Education
      </Link>
    </div>
  );
};

export default DashboardActions;
