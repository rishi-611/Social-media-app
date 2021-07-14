import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const Comment = ({ comment }) => {
  const { user, avatar, name, date, text } = comment;
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profiles/${user}`}>
          <img className="round-img" src={avatar} alt="user avatar" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="DD/MM/YY">{date}</Moment>
        </p>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;
