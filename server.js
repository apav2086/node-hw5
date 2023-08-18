
const mongoose = require("mongoose");
const app = require("./app");
const session = require("express-session");
const { DB_HOST, PORT = 3000 } = process.env;

const sess = {
  secret: process.env.JWT_SECRET,
   cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
};
app.use(session(sess));

mongoose.connect(DB_HOST)
 .then(() => {
app.listen(PORT, () => {
      console.log("Database connection successful");
  });
 })
  .catch(error => {
    console.log(error.message);
process.exit(1);
});
