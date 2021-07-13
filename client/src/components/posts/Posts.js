import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts, addLike, removeLike, deletePost } from "../../actions/posts";
import Spinner from "../layout/Spinner";
import { Link, Redirect } from "react-router-dom";
import Moment from "react-moment";
import PostForm from "./PostForm";

const Posts = ({
  postObj,
  getPosts,
  addLike,
  removeLike,
  authenticated,
  auth,
  deletePost,
}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const { posts, loading } = postObj;

  if (!authenticated) {
    return <Redirect to="/login" />;
  }
  if (loading || !posts) {
    return <Spinner />;
  }

  const handleDeleteClick = (e, postId) => {
    deletePost(postId);
  };

  const renderPosts = () =>
    posts.map((post) => (
      <div className="post bg-white p-1 my-1" key={post._id}>
        <div>
          <Link to={`/profiles/${post.user}`}>
            <img className="round-img" src={post.avatar} alt="user avatar" />
            <h4>{post.name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{post.text}</p>
          <p className="post-date">
            Posted on <Moment format="DD/MM/YY">{post.date}</Moment>
          </p>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => addLike(post._id)}
          >
            <i className="fas fa-thumbs-up"></i>
            <span>{post.likes.length}</span>
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => removeLike(post._id)}
          >
            <i className="fas fa-thumbs-down"></i>
          </button>
          <Link to={`/posts/${post._id}`} className="btn btn-primary">
            Comments{" "}
            <span className="comment-count">{post.comments.length}</span>
          </Link>
          {post.user === auth.user?._id ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => handleDeleteClick(e, post._id)}
            >
              <i className="fas fa-times"></i>
            </button>
          ) : null}
        </div>
      </div>
    ));
  return (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome to the community!
      </p>

      <PostForm />

      <div className="posts">
        {posts.length === 0 ? "No posts to display right now" : renderPosts()}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  postObj: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  postObj: state.posts,
  authenticated: state.auth.authenticated,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPosts,
  addLike,
  removeLike,
  deletePost,
})(Posts);
