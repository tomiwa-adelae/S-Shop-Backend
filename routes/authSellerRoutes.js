import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Import Seller user Model
import UserSeller from '../models/userSellerModel.js';

import generateToken from '../utils/generateToken.js';

// Login a seller
// POST @/api/auth/sellers
// Public
router.post('/', async (req, res) => {
   try {
      const {
         email,
         password,
      } = req.body;

      // Simple validation
      if (
         !email ||
         !password
      )
         return res
            .status(409)
            .json({ msg: 'Please enter all fields!' });


      const seller = await UserSeller.findOne({ email })

      if(!seller) return res.status(409).json({ msg: 'Seller does not exist! Please create an account now!' })

      // Compare password
      bcrypt.compare(password, seller.password)
      .then(isMatch => {
         if(!isMatch) return res.status(409).json({ msg:'Invalid password!' })

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
      })


      // // Check if seller exist already
      // const sellerExists = await UserSeller.findOne({ email });

      // if (sellerExists)
      //    return res
      //       .status(409)
      //       .json({
      //          msg: 'Seller already exist! Please login to your S-Shop seller account!',
      //       });

    
   } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
