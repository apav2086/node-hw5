const User = require("../models/users");
const Contacts = require('../models/contacts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
// const uploadPath = path.join(process.cwd(), 'upload');
const tmpPath = path.join(process.cwd(), 'tmp');
// const imagesPath = path.join(process.cwd(), 'images');
const avatarPath = path.join(process.cwd(), 'public/avatars');
const gravatar = require('gravatar');
const userController = {
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const hashed = await bcrypt.hash(password, 10);
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });
            const newUser = await User.create({
                email: email,
                password: hashed,
                token: token,
            });
            const avatarURL = gravatar.url(newUser.email);
            console.log(avatarURL);
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
        if (req.session.userToken) {
            res.json({ email, subscription });
        } else {
            res.json({ message: 'Not authorized' })
     
        }
    },


  async uploadFile(req, res) {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, tmpPath);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({
      storage: storage,
      limits: {
        fileSize: 1048576
      },
    })
     const user = await Contacts.findOne({ _id: '64c9add42ed076db1e8f5eec' });
    console.log(user.id);
    upload.single('avatar')(req, res, async function () {
      const { path: tempName } = req.file;
      console.log(path);
      const fileName = path.join(avatarPath, user.id + '.jpg');
      await fs.rename(tempName, fileName);
     res.json(req.file);
    });
 
    },
    
};

module.exports = userController;