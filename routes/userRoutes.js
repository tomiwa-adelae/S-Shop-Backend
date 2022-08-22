import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Import User Model
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// Create new user
// POST @/api/users
// Public
router.post('/', async (req, res) => {
   try {
      // Remove values from request body
      const {
         firstName,
         lastName,
         email,
         phoneNumber,
         password,
         confirmPassword,
         isAdmin,
         isSShopAdmin,
      } = req.body;

      //   Check if User exist already
      const userExist = await User.findOne({ email });

      if (userExist)
         return res
            .status(409)
            .json({ msg: 'User already exist! Please login with your email!' });

      // Form Validation
      if (!firstName || !lastName || !email || !phoneNumber || !password)
         return res.status(409).json({ msg: 'Please enter all fields!' });

      if (phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0')
         return res
            .status(400)
            .json({ msg: 'Please enter a valid phoneNumber!' });

      if (password !== confirmPassword)
         return res.status(400).json({ msg: 'Password does not match!' });

      if (password.length <= 5)
         return res.status(400).json({
            msg: 'Password character should be at least 6 character long!',
         });

      const newUser = new User({
         firstName,
         lastName,
         email,
         phoneNumber,
         password,
         isAdmin,
      });

      //   Hash user password
      bcrypt.genSalt(14, (err, salt) => {
         bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Setting newUser password to the hash password
            newUser.password = hash;

            // Save new user to DB
            newUser
               .save()
               .then((user) => {
                  // Generate JWT Tokem
                  const token = generateToken(user);
                  res.status(201).json({
                     token,
                     user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        isAdmin: user.isAdmin,
                     },
                  });
               })
               .catch((err) =>
                  res
                     .status(500)
                     .json({ msg: 'An error occured! Please try again!' })
               );
         });
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
});

export default router;
