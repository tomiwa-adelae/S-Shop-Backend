
import express from 'express';
import bcrypt from 'bcryptjs';
import cloudinary from '../middleware/cloudinary.js';

const router = express.Router();

// Import Seller user Model
import UserSeller from '../models/userSellerModel.js';

import generateToken from '../utils/generateToken.js';

// Create new seller
// POST @/api/users/sellers
// Public
router.post('/', async (req, res) => {
   try {
      const {
         firstName,
         lastName,
         email,
         phoneNumber,
         additionalPhoneNumber,
         brandName,
         brandLogo,
         accountNumber,
         bankName,
         nameOfAccountHolder,
         password,
         retypePassword,
      } = req.body;

      // Simple validation
      if (
         !firstName ||
         !lastName ||
         !email ||
         !phoneNumber ||
         !accountNumber ||
         !bankName ||
         !nameOfAccountHolder ||
         !password || 
         !retypePassword
      )
         return res
            .status(409)
            .json({ msg: 'Please enter all asterisked fields!' });

      if (phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0')
         return res
            .status(409)
            .json({ msg: 'Please enter a valid phone number!' });

      if (accountNumber.length !== 10)
         return res
            .status(409)
            .json({ msg: 'Please enter a vaild account number!' });

      if (password !== retypePassword)
         return res.status(409).json({ msg: 'Password does not match!' });

      if (password.length <= 5)
         return res.status(409).json({
            msg: 'Password should be at least 6 character long!',
         });

      // Check if seller exist already
      const sellerExists = await UserSeller.findOne({ email });

      if (sellerExists)
         return res
            .status(409)
            .json({
               msg: 'Seller already exist! Please login to your S-Shop seller account!',
            });

      if (brandLogo) {
         const uploadResponse = await cloudinary.v2.uploader.upload(brandLogo, {
            upload_preset: 'sshop',
         });

         const newSeller = new UserSeller({
            firstName,
            lastName,
            email,
            phoneNumber,
            additionalPhoneNumber,
            brandName,
            accountNumber,
            bankName,
            nameOfAccountHolder,
            password,
            retypePassword,
            brandLogo: uploadResponse.url,
            brandLogoId: uploadResponse.public_id,
         });

         // Hash password
         bcrypt.genSalt(14, (err, salt) => {
            bcrypt.hash(newSeller.password, salt, (err, hash) => {
               if (err) throw err;

               // Set new seller's password to hash
               newSeller.password = hash;

               // Save new seller
               newSeller.save().then((seller) => {
                  // Generate JWT Tokem
                  const token = generateToken(seller);

                  res.status(201).json({
                     token,
                     seller: {
                        id: seller._id,
                        firstName: seller.firstName,
                        lastName: seller.lastName,
                        email: seller.email,
                        phoneNumber: seller.phoneNumber,
                        additionalPhoneNumber: seller.additionalPhoneNumber,
                        isAdmin: seller.isAdmin,
                        brandName: seller.brandName,
                        brandLogo: seller.brandLogo,
                        brandLogoId: seller.brandLogoId,
                        accountNumber: seller.accountNumber,
                        bankName: seller.bankName,
                        nameOfAccountHolder: seller.nameOfAccountHolder,
                        picture: seller.picture,
                     },
                  });
               });
            });
         });
      } else {
         const newSeller = new UserSeller({
            firstName,
            lastName,
            email,
            phoneNumber,
            additionalPhoneNumber,
            brandName,
            accountNumber,
            bankName,
            nameOfAccountHolder,
            password,
            retypePassword,
            brandLogo,
            brandLogoId: '',
         });

         // Hash password
         bcrypt.genSalt(14, (err, salt) => {
            bcrypt.hash(newSeller.password, salt, (err, hash) => {
               if (err) throw err;

               // Set new seller's password to hash
               newSeller.password = hash;

               // Save new seller
               newSeller.save().then((seller) => {
                  // Generate JWT Tokem
                  const token = generateToken(seller);

                  res.status(201).json({
                     token,
                     seller: {
                        id: seller._id,
                        firstName: seller.firstName,
                        lastName: seller.lastName,
                        email: seller.email,
                        phoneNumber: seller.phoneNumber,
                        additionalPhoneNumber: seller.additionalPhoneNumber,
                        isAdmin: seller.isAdmin,
                        brandName: seller.brandName,
                        brandLogo: seller.brandLogo,
                        brandLogoId: seller.brandLogoId,
                        accountNumber: seller.accountNumber,
                        bankName: seller.bankName,
                        nameOfAccountHolder: seller.nameOfAccountHolder,
                        picture: seller.picture,
                     },
                  });
               });
            });
         });
      }
   } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
