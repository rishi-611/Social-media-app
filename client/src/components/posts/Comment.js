import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { deleteComment } from "../../actions/posts";
import { connect } from "react-redux";

const Comment = ({ comment, currentUser, postId, deleteComment }) => {
  const { user, avatar, name, date, text } = comment;
  const handleDeleteClick = (e, postId, commentId) =>
    deleteComment(postId, commentId);

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
        {user === currentUser?._id ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={(e) => handleDeleteClick(e, postId, comment._id)}
          >
            <i className="fas fa-times"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
};

export default connect(null, { deleteComment })(Comment);
