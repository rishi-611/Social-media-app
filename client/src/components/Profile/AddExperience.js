import { connect } from "react-redux";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { addExperience } from "../../actions/profile";

const AddExperience = ({ addExperience, history }) => {
  const [toDateDisabled, toggleToDate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const { title, company, location, from, to, current, description } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (formData.current) delete formData.to;
    addExperience(formData, history);
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Experience</h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any internship, job,
        freelance projects, etc
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Title of your Position"
            name="title"
            value={title}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Your company, or the company you worked for"
            name="company"
            value={company}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              onChange={(e) => onChange(e)}
              value={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !formData.current });
                toggleToDate(!toDateDisabled);
              }}
            />
            Currently working for the company?
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
            disabled={toDateDisabled ? true : false}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Experience Description"
            value={description}
            onChange={(e) => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

export default connect(null, { addExperience })(AddExperience);
