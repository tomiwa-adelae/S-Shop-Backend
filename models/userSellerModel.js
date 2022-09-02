import mongoose from 'mongoose';

const userSellerSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      phoneNumber: {
         type: String,
         required: true,
         trim: true,
      },
      brandName: {
         type: String,
      },
      brandLogo: {
         type: String,
         default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
      },
      brandLogoId: {
         type: String
      },
      accountNumber: {
         type: String,
         required: true
      },
      bankName: {
         type: String,
         required: true
      },
      nameOfAccountHolder: {
         type: String, required: true
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      password: {
         type: String,
         required: true,
      },
      isAdmin: {
         type: Boolean,
         required: true,
         default: true,
      },
      isSShopAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

const UserSeller = mongoose.model('UserSeller', userSellerSchema);

export default UserSeller;
