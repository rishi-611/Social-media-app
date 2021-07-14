import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getPostById, addComment } from "../../actions/posts";
import Spinner from "../layout/Spinner";
import Comment from "./Comment";
import Moment from "react-moment";

const Post = ({
  match,
  getPostById,
  addComment,
  post,
  loading,
  error,
  CurrentUser,
}) => {
  const [formText, setFormText] = useState("");

  useEffect(() => {
    if (!post) {
      getPostById(match.params.id);
    }
  }, [post]);

  if (!loading && error && !post) {
    return <div>Failed to fetch post</div>;
  }

  if (loading || !post) {
    return <Spinner />;
  }

  const { _id, name, text, avatar, date, user, comments, likes, currentUser } =
    post;

  const onChange = (e) => setFormText(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(_id, formText);
  };

  return (
    <Fragment>
      <Link to="/posts" className="btn btn-dark">
        Back To Posts
      </Link>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${user}`}>
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

      <div className="post-form">
        <div className="bg-primary p">
          <h3>Leave A Comment</h3>
        </div>
        <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Comment on this post"
            onChange={(e) => onChange(e)}
            value={formText}
            required
          ></textarea>
          <input
            type="submit"
            className="btn btn-dark my-1"
            value="Submit"
            onChange={(e) => onChange(e)}
          />
        </form>
      </div>

      <div className="comments">
        {comments.length === 0
          ? "No comments yet"
          : comments.map((comment, i) => (
              <Fragment key={i}>
                <Comment comment={comment} currentUser={currentUser} />
              </Fragment>
            ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPostById: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.posts.post,
  loading: state.posts.loading,
  error: state.posts.error,
  currentUser: state.auth.user,
});

export default connect(mapStateToProps, { getPostById, addComment })(Post);
