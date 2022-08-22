import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Import User Model
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// Login a user
// POST @/api/auth
// Public
router.post('/', async (req, res) => {
   try {
      // Remove values from request body
      const { email, password } = req.body;

      // Form Validation
      if (!email || !password)
         return res.status(409).json({ msg: 'Please enter all fields!' });

      //   Check if User exist in Database
      const user = await User.findOne({ email });

      if (!user)
         return res.status(409).json({
            msg: 'User does not exist! Please create an account now!',
         });

      //   Compare password with hashed password in Database
      bcrypt
         .compare(password, user.password)
         .then((isMatch) => {
            if (!isMatch)
               return res.status(409).json({ msg: 'Invalid password!' });

            // Generate JWT Token
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
         .catch(() =>
            res.status(500).json({ msg: 'An error occured! Please try again!' })
         );
   } catch (err) {
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
});

export default router;
