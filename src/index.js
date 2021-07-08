const express = require("express");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postsRouter");
const profileRouter = require("./routes/profileRouter");
require("./db/mongoose");

const PORT = process.env.PORT || 3000;

const app = express();

// the first optional router provided becomes "/" for the router
// "/api/users" in app.use=> request to /api/users will equal to to request to "/" on users route
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/profile", profileRouter);
// app.use("/api/auth", postRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
