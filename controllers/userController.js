const User = require("../models/users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
 const fs = require('fs').promises;
const path = require('path');
const tmpPath = path.join(process.cwd(), 'tmp');
const gravatar = require('gravatar');
const Jimp = require("jimp");
 
const userController = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
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
                res.json({ message: 'No user found with that account' });
                return;
            }
           
            const validatingPW = await singleUser.checkPassword(password);
            if (!validatingPW) {
                res.json({ message: 'Wrong Password' });
                return;
            }
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
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
                res.json({ message: 'User was signed out' });
            })
        } else {
            res.json({ message: 'User is already signed out' })
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
            res.json({ message: 'Not authorized' })
     
        }
    },
    //  async uploadFile(req, res) { },


    async avatarUpload(req, res) {
        const { email } = req.body; // Extract the email from the request body
        await User.findOne({ email: email }); // Find the user based on the email

        // Create a Multer storage configuration for uploading avatars
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, tmpPath); // Set the temporary storage destination
            },
            filename: (req, file, cb) => {
                const uniqueFilename = `${Date.now()}-${file.originalname}`;
                cb(null, uniqueFilename); // Generate a unique filename for the uploaded file
            },
        });
      
        // Configure Multer with the storage and limits
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 1048576, // Limit the file size to 1 MB
            },
        });

        // Use the 'upload' middleware to process the uploaded file
        upload.single("avatar")(req, res, async function () {
    
            const { path: tempName } = req.body; // Get the temporary path of the uploaded file

            // Define the path where avatars will be stored
 const avatarPath = path.join(__dirname, "public/avatars");

            const fileName = path.join(avatarPath, email + ".jpg");

           // Generate the filename based on the user's email

            await fs.rename(tempName, fileName); // Rename the temporary file to the final filename
        });
    },

    
     async avatarUpdate(req, res) {
        
        // Read the avatarURL from the request body
        const avatarURL = req.body.avatarURL;

        // Read the avatar image using Jimp
        const avatar = await Jimp.read(avatarURL);

        // Resize the avatar image to 250x250 pixels and save it
        await avatar.resize(250, 250).write(fileName);

        // Send a JSON response with the updated avatarURL
        res.json({
         avatarURL: `/avatars/${path.basename(fileName)}`
        });
    },
}

module.exports = userController;