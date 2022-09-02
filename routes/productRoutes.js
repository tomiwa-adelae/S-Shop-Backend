import express from 'express';

// Importing Product model
import Product from '../models/productModel.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get all products
// GET @/api/products
// Public
router.get('/', async (req, res) => {
   try {
      const keyword = req.query.keyword
         ? {
              $or: [
                 {
                    name: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    productImage: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    description: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    brand: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
                 {
                    category: {
                       $regex: req.query.keyword,
                       $options: 'i',
                    },
                 },
              ],
           }
         : {};

      const products = await Product.find({...keyword}).sort({ createdAt: -1 });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get 10 latest products
// GET @/api/products/latest
// Public
// router.get('/latest', async (req, res) => {
//    try {
//       const products = await Product.find().sort({ createdAt: -1 }).limit(10);

//       res.status(200).json(products);
//    } catch (err) {
//       res.status(500).json({ msg: 'An error occured!' });
//    }
// });

// Get most rated products
// Get @/api/products/most/rated/products
// Public
router.get('/most/rated/products', async (req, res) => {
   try {
      const products = await Product.find({}).sort({ rating: -1 });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get more products from current brand
// GET @/api/products/more/:brand/products/:id
// Public
router.get('/more/:brand/products/:id', async (req, res) => {
   const { brand, id } = req.params;
   try {
      const products = await Product.find({
         brand: brand,
         _id: { $ne: id },
      })
         .sort({ createdAt: -1 })
         .limit(10);

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get all products from current brand
// GET @/api/products/all/:brand/products
// Public
router.get('/all/:brand/products', async (req, res) => {
   const { brand } = req.params;
   try {
      const products = await Product.find({
         brand: brand,
      }).sort({ createdAt: -1 });

      if (products.length === 0)
         return res.status(400).json({ msg: 'Brand does not exist!' });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get similar products
// Get /@api/products/similar/products/:category/:id
// Public
router.get('/similar/products/:category/:id', async (req, res) => {
   try {
      const products = await Product.find({
         category: req.params.category,
         _id: { $ne: req.params.id },
      })
         .sort({ createdAt: -1 })
         .limit(10);

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get products based on category
// Get /@api/products/category/products/:category
// Public
router.get('/category/products/:category', async (req, res) => {
   try {
      const products = await Product.find({
         category: req.params.category,
      }).sort({ createdAt: -1 });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get a single product
// Get @/api/products/:id
// Public
router.get('/:id', async (req, res) => {
   try {
      const product = await Product.findById(req.params.id);

      if (!product) return res.status(404).json({ msg: 'Product not found!' });

      res.status(200).json(product);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured! Please try again!' });
   }
});

// Create customer reviews
// POST @/api/products/:id/reviews
// Private

router.post('/:id/reviews', auth, async (req, res) => {
   try {
      const { comment, rating, firstName, lastName } = req.body;

      Product.findById(req.params.id)
         .then((product) => {
            if (product) {
               const alreadyReviewed = product.reviews.find(
                  (r) => r.user.toString() === req.user.id._id
               );

               if (alreadyReviewed)
                  return res
                     .status(400)
                     .json({ msg: 'Product already reviewed by you!' });

               if (!comment || !rating)
                  return res.status(400).json({ msg: 'An error occured!' });

               const review = {
                  name: `${firstName} ${lastName}`,
                  user: req.user.id._id,
                  comment,
                  rating,
               };

               product.reviews.unshift(review);

               product.numReviews = product.reviews.length;

               product.rating =
                  product.reviews.reduce(
                     (acc, item) => Number(item.rating) + acc,
                     0
                  ) / product.reviews.length;

               product
                  .save()
                  .then(() => res.status(201).json(product))
                  .catch((err) =>
                     res.status(400).json({ msg: 'An error occured!' })
                  );
            }
         })
         .catch((err) => res.status(400).json({ msg: 'An error occured!' }));
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
