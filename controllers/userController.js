const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const tmpPath = path.join(process.cwd(), "tmp");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userController = {
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const avatarURL = gravatar.url(email);
      const newUser = await User.create({
        email: email,
        password: hashed,
        token: token,
        avatarURL: avatarURL,
      });
      await newUser.save();
      req.session.userToken = token;
      console.log(req.session);
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const singleUser = await User.findOne({ email: email });
      if (!singleUser) {
        res.json({ message: "No user found with that account" });
        return;
      }

      const validatingPW = await singleUser.checkPassword(password);
      if (!validatingPW) {
        res.json({ message: "Wrong Password" });
        return;
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      req.session.userToken = token;
      res.json({ token });
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  async logout(req, res) {
    if (req.session.userToken) {
      req.session.destroy(() => {
        res.json({ message: "User was signed out" });
      });
    } else {
      res.json({ message: "User is already signed out" });
    }
  },
  async current(req, res) {
    const { email, subscription } = req.body;
    console.log(
      "🚀 ~ file: userController.js:70 ~ current ~ req.body:",
      req.body
    );
    if (req.session.userToken) {
      res.json({ email, subscription });
    } else {
      res.json({ message: "Not authorized" });
    }
  },

  // This is a middleware that uses the 'upload' multer instance to handle a single file upload with the field name "avatar".
  avatarUpload: upload.single("avatar"),

  async handleAvatarUpload(req, res) {
    try {
      const { email } = req.body; // Extract the email from the request body

      const uploadedFileBuffer = req.file.buffer; // Get the buffer containing the uploaded file's binary data
      const avatarPath = path.join(process.cwd(), "public", "avatars"); // Construct the path to the avatars directory
      const fileName = path.join(avatarPath, email + ".jpg"); // Construct the path to the desired file location

      await fs.writeFile(fileName, uploadedFileBuffer); // Write the binary data to the file

      // Find the user based on their email and update their avatarURL field
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { avatarURL: `/avatars/${email}.jpg` }, // Update the avatarURL field
        { new: true } // Return the updated user object
      );

      // Send a JSON response indicating successful avatar upload along with the updated user object
      res.json({
        message: "Avatar uploaded successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.log("Error uploading avatar", error); // Log the error if something goes wrong
      res.status(500).json({ message: "Error uploading avatar" }); // Send an error response with a 500 status code
    }
  },

  async avatarUpdate(req, res) {
    try {
    const { email } = req.body;
    const avatarPath = path.join(process.cwd(), "public", "avatars");
    // Read the avatarURL from the request body
      const fileName = path.join(avatarPath, email + ".jpg");
      
 // Read the uploaded avatar buffer from the request
      const uploadedFileBuffer = req.file.buffer;

     // Use Jimp to read the avatar image from the buffer
      const avatar = await Jimp.read(uploadedFileBuffer);

    // Resize the avatar image to 250x250 pixels and save it
    avatar.resize(250, 250);
 // Delete the previous avatar image if it exists
      try {
        await fs.unlink(fileName);
      } catch (unlinkError) {
        // Handle the error if the file doesn't exist
      }

      // Write the updated avatar image back to the file
      await avatar.writeAsync(fileName);

      // Send a JSON response with the updated avatarURL
      res.json({
        avatarURL: `/avatars/${email}.jpg`,
      });
    } catch (error) {
      console.log("Error updating avatar", error);
      res.status(500).json({ message: "Error updating avatar" });
    }
  },
};

module.exports = userController;