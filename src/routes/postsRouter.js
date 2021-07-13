const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../db/models/Post");

const postRouter = express.Router();

// route: POST /api/posts
// creates new post for authenticated user
// PRIVATE
postRouter.post(
  "/",
  [auth, [check("text", "text field can not be empty").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const { name, avatar } = user;
    const { text } = req.body;
    const date = new Date();

    const post = { name, text, avatar, date };
    post.user = user._id;

    try {
      const newPost = new Post(post);
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).json();
    }
  }
);

//  route: PUT /api/posts/like/:postId
// adds like object to the likes array
// PRIVATE
postRouter.put("/like/:postId", auth, async (req, res) => {
  const user = req.user;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    // if  post.likes does not already have a like from this user, then append one
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === user._id.toString()
    );

    if (likeIndex !== -1) {
      return res
        .status(400)
        .json({ errors: [{ msg: "post can only be liked one time" }] });
    }

    const like = {
      user: user._id,
      date: new Date(),
    };
    post.likes.unshift(like);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    res.status(500).json();
  }
});

//  route: DELETE /api/posts/like/:postId
// adds like object to the likes array of post
// PRIVATE
postRouter.delete("/like/:postId", auth, async (req, res) => {
  const user = req.user;
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    // if  post.likes already have a like from this user, then remove it
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === user._id.toString()
    );

    if (likeIndex === -1) {
      return res.status(400).json({
        errors: [
          {
            msg: "you can only unlike a post if you have previously liked it. this app does not support dislike feature",
          },
        ],
      });
    }

    post.likes.splice(likeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    res.status(500).json();
  }
});

//  route: PUT /api/posts/comment/:postId
// adds comments object to the comment array of post
// PRIVATE
postRouter.put(
  "/comment/:postId",
  auth,
  check("text", "text field can not be empty").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);
    const text = req.body.text;
    try {
      const post = await Post.findById(req.params.postId);
      const { user } = req;
      if (!post) {
        return res.status(404).json({ errors: [{ msg: "post not found" }] });
      }
      const comment = {
        user: user._id,
        avatar: user.avatar,
        name: user.name,
        date: new Date(),
        text,
      };
      post.comments.unshift(comment);
      await post.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ errors: [{ msg: "post not found" }] });
      }

      res.status(500).json();
    }
  }
);

//  route: DELETE /api/posts/comment/:postId
// removes comments object to the comment array of post
// PRIVATE
postRouter.delete("/comment/:postId/:commentId", auth, async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    const { user } = req;
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ errors: [{ msg: "comment not found" }] });
    }
    // only the author of post or the user who created can delete the comment
    const comment = post.comments[commentIndex];
    console.log(
      user._id.toString() !== comment.user.toString() &&
        user._id.toString() !== post.user.toString()
    );
    if (
      user._id.toString() !== comment.user.toString() &&
      user._id.toString() !== post.user.toString()
    ) {
      return res
        .status(401)
        .json({ errors: [{ msg: "unauthorized to complete this request" }] });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }

    res.status(500).json();
  }
});

// route: GET /api/posts
// gets all posts
// PRIVATE
postRouter.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
});

// route: GET /api/posts/:postId
// gets post by id
// PRIVATE
postRouter.get("/:postId", auth, async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ errors: [{ msg: "invalid post id" }] });
    }
    res.status(500).json({ errors: [{ msg: "server error" }] });
  }
});

// route: DELETE/api/posts/:postId
// deletes post by id
// PRIVATE
postRouter.delete("/:postId", auth, async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ errors: [{ msg: "post not found" }] });
    }
    // check if user is owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ errors: [{ msg: "user not authorized" }] });
    }

    await post.remove();
    res.json(post);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json("Invalid post id");
    }
    res.status(500).json({ errors: [{ msg: "invalid post id" }] });
  }
});

module.exports = postRouter;
