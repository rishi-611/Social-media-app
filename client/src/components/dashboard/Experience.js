import React, { Fragment } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteExperience } from "../../actions/profile";

const Experience = ({ experience, deleteExperience }) => {
  const handleDeleteBtn = (e, id) => {
    deleteExperience(id);
  };

  const renderExperience = () => {
    return experience.map((expField) => (
      <tr key={expField._id}>
        <td>{expField.company}</td>
        <td>{expField.title}</td>
        <td>
          <Moment format="DD/MM/YYYY">{expField.from}</Moment>:{" "}
          {expField.current ? (
            "Now"
          ) : (
            <Moment format="DD/MM/YYYY">{expField.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              handleDeleteBtn(e, expField._id);
            }}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <Fragment>
      <h2 className="my-2">Experience Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderExperience()}</tbody>
      </table>
    </Fragment>
  );
};

export default connect(null, { deleteExperience })(Experience);
