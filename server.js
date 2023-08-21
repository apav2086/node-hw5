
const mongoose = require("mongoose");
const app = require("./app");
const session = require("express-session");
const { DB_HOST, PORT = 3000, JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  console.error("JWT_SECRET not defined in environment variables.");
  process.exit(1);
}

if (!DB_HOST) {
  console.error("DB_HOST not defined in environment variables.");
  process.exit(1);
}

const sess = {
  secret: JWT_SECRET,
   cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
};

const startServer = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");
    app.use(session(sess));
        app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};
startServer();
