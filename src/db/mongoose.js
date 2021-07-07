const mongoose = require("mongoose");

const connectionURL = process.env.MONGO_URL;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch(() => console.log("could not connect to database"));
