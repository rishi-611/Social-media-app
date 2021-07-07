const express = require("express");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postsRouter");

const PORT = process.env.PORT;

const app = express();

// the first optional router provided becomes "/" for the router
// "/api/users" in app.use=> request to /api/users will equal to to request to "/" on users route
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", postRouter);
app.use("/api/auth", postRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
