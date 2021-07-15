const express = require("express");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postsRouter");
const profileRouter = require("./routes/profileRouter");
const path = require("path");
require("./db/mongoose");

const PORT = process.env.PORT || 5000;

const app = express();

// the first optional router provided becomes "/" for the router
// "/api/users" in app.use=> request to /api/users will equal to to request to "/" on users route
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);
// app.use("/api/auth", postRouter);

// serve static assets on production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
