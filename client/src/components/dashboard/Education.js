import React, { Fragment } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { deleteEducation } from "../../actions/profile";

const Education = ({ education, deleteEducation }) => {
  const handleDeleteBtn = (e, id) => {
    deleteEducation(id);
  };

  const renderEducation = () => {
    return education.map((educField) => (
      <tr key={educField._id}>
        <td>{educField.school}</td>
        <td>{educField.degree}</td>
        <td>
          <Moment format="DD/MM/YYYY">{educField.from}</Moment>:{" "}
          {educField.current ? (
            "Now"
          ) : (
            <Moment format="DD/MM/YYYY">{educField.to}</Moment>
          )}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={(e) => {
              handleDeleteBtn(e, educField._id);
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
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th>Degree</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{renderEducation()}</tbody>
      </table>
    </Fragment>
  );
};

export default connect(null, { deleteEducation })(Education);
