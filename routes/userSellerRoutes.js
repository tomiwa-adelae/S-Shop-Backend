import express from 'express';
import bcrypt from 'bcryptjs';
import cloudinary from '../middleware/cloudinary.js';

const router = express.Router();

// Import Seller user Model
import UserSeller from '../models/userSellerModel.js';

import generateToken from '../utils/generateToken.js';

import {auth} from '../middleware/auth.js'

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

         if(brandLogo){
            const uploadResponse = await cloudinary.v2.uploader.upload(brandLogo, {
               upload_preset: 'sshop'
            })

            const newSeller = new UserSeller({
               firstName,
               lastName,
               email,
               phoneNumber,
               brandName,
               accountNumber,
               bankName,
               nameOfAccountHolder,
               password,
               retypePassword,
               brandLogo: uploadResponse.url,
               brandLogoId: uploadResponse.public_id
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
                           isAdmin: seller.isAdmin,
                           brandName: seller.brandName,
                           brandLogo: seller.brandLogo,
                           brandLogoId: seller.brandLogoId,
                           accountNumber: seller.accountNumber,
                           bankName: seller.bankName,
                           nameOfAccountHolder: seller.nameOfAccountHolder,
                        },
                     });
                  });
               });
            });

         }else{
            const newSeller = new UserSeller({
               firstName,
               lastName,
               email,
               phoneNumber,
               brandName,
               accountNumber,
               bankName,
               nameOfAccountHolder,
               password,
               retypePassword,
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
                           isAdmin: seller.isAdmin,
                           brandName: seller.brandName,
                           accountNumber: seller.accountNumber,
                           bankName: seller.bankName,
                           nameOfAccountHolder: seller.nameOfAccountHolder,
                        },
                     });
                  });
               });
            });
         }
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});


// Update seller's profile
// PUT @/api/users/sellers/profile
// Private
router.put('/profile', auth, async(req, res) => {
   try{
      const {firstName, lastName, phoneNumber, brandName, brandLogo, accountNumber, bankName, nameOfAccountHolder, email} = req.body

      const user = await UserSeller.findById(req.user.id)

      if(!user) return res.status(404).json({ msg: 'Seller does not exist! An error occured!' })

      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.brandName = brandName || user.brandName;
      user.accountNumber = accountNumber || user.accountNumber;
      user.bankName = bankName || user.bankName;
      user.nameOfAccountHolder = nameOfAccountHolder || user.nameOfAccountHolder;

      if(phoneNumber.length !== 11 || phoneNumber.charAt(0) !== '0') return res.status(409).json({ msg: 'Please enter a valid phone number!' })

      if (accountNumber.length !== 10)
         return res
            .status(409)
            .json({ msg: 'Please enter a vaild account number!' });

      if(brandLogo) {
          const uploadResponse = await cloudinary.v2.uploader.upload(brandLogo, {
               upload_preset: 'sshop'
            })

         await cloudinary.uploader.destroy(
            user.brandLogoId,
            { invalidate: true },
            {
               upload_preset: 'sshop',
            }
         );

         user.brandLogo = uploadResponse.url || user.brandLogo;
         user.brandLogoId =  uploadResponse.public_id || user.brandLogoId

          const savedUser = await user.save()

            const token = generateToken(savedUser);

            res.status(201).json({
               token,
               seller: {
                  id: savedUser._id,
                  firstName: savedUser.firstName,
                  lastName: savedUser.lastName,
                  email: savedUser.email,
                  phoneNumber: savedUser.phoneNumber,
                  isAdmin: savedUser.isAdmin,
                  brandName: savedUser.brandName,
                  brandLogo: savedUser.brandLogo,
                  brandLogoId: savedUser.brandLogoId,
                  accountNumber: savedUser.accountNumber,
                  bankName: savedUser.bankName,
                  nameOfAccountHolder: savedUser.nameOfAccountHolder,             
               },
            })
      }else{
          user.brandLogo = user.brandLogo;
         user.brandLogoId = user.brandLogoId

          const savedUser = await user.save()

            const token = generateToken(savedUser);

            res.status(201).json({
               token,
               seller: {
                  id: savedUser._id,
                  firstName: savedUser.firstName,
                  lastName: savedUser.lastName,
                  email: savedUser.email,
                  phoneNumber: savedUser.phoneNumber,
                  isAdmin: savedUser.isAdmin,
                  brandName: savedUser.brandName,
                  brandLogo: savedUser.brandLogo,
                  brandLogoId: savedUser.brandLogoId,
                  accountNumber: savedUser.accountNumber,
                  bankName: savedUser.bankName,
                  nameOfAccountHolder: savedUser.nameOfAccountHolder,             
               },
            })
      }   
   }catch(err){
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
})


export default router;
