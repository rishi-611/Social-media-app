import React, { Fragment } from "react";
import Moment from "react-moment";

const Education = ({ education }) => {
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
          <button className="btn btn-danger">Delete</button>
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

export default Education;
