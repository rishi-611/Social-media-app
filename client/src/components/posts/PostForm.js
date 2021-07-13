import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createPost } from "../../actions/posts";

const PostForm = ({ createPost }) => {
  const [formData, setFormData] = useState({
    text: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("post onSubmit");
    createPost(formData);
    setFormData({
      text: "",
    });
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form className="form my-1" onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={formData.text}
          onChange={(e) => onChange(e)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  createPost: PropTypes.func.isRequired,
};

export default connect(null, { createPost })(PostForm);
