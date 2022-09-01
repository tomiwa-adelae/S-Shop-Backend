import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Import User Model
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

import {auth} from '../middleware/auth.js'

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
            .json({ msg: 'Please enter a valid phone number!' });

      if (password !== confirmPassword)
         return res.status(400).json({ msg: 'Password does not match!' });

      if (password.length <= 5)
         return res.status(400).json({
            msg: 'Password should be at least 6 character long!',
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
                        isAdmin: user.isAdmin, picture: user.picture
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

// Update user profile
// PUT @/api/users/profile
// Private
router.put('/profile', auth, async(req, res) => {
   try{
      const {firstName, lastName, phoneNumber} = req.body.user

      const user = await User.findById(req.user.id)

      if(!user) return res.status(404).json({ msg: 'User does not exist! An error occured!' })

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      if(phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0') return res.status(409).json({ msg: 'Please enter a valid phone number!' })

      user.phoneNumber = phoneNumber || user.phoneNumber;

      const savedUser = await user.save()

      const token = generateToken(savedUser);

      res.status(201).json({
         token,
         user: {
            id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            phoneNumber: savedUser.phoneNumber,
            isAdmin: savedUser.isAdmin, picture: user.picture
         }
      })

   }catch(err){
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
})

// Update user login details
// PUT @/api/users/profile/login
// Private
router.put('/profile/login', auth, async(req, res) => {
   try{
      const {currentPassword, newPassword, retypePassword} = req.body.passwords

      const user = await User.findById(req.user.id)

      if(!user) return res.status(404).json({ msg: 'User does not exist! An error occured!' })

         if(!currentPassword || !newPassword || !retypePassword) return res.status(409).json({ msg: 'Please enter all fields!' })

     bcrypt.compare(currentPassword, user.password)
  .then(isMatch => {
   if(!isMatch) return res.status(409).json({ msg: 'Invalid current password!' })

      if(newPassword.length <= 5) return res.status(400).json({
            msg: 'New password should be at least 6 character long!',
         });

      if(newPassword !== retypePassword) return res.status(409).json({ msg: 'Passwords do not match!' })

      user.password = newPassword

   //   Hash user password
      bcrypt.genSalt(14, (err, salt) => {
         bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;

            // Setting newUser password to the hash password
            user.password = hash;

            console.log(user)

            // Save new user to DB
            user
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
                        picture: user.picture
                     },
                  });
               })
               .catch((err) =>
                  res
                     .status(500)
                     .json({ msg: 'An error occured! Please try again!' })
               );
         });
      })
  })

   }catch(err){
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
})

export default router;
