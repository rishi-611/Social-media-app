const mongoose = require("mongoose");

const connectionURL = process.env.MONGO_URL;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database connected"))
  .catch(() => console.log("could not connect to database"));
