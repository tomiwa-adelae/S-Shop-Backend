import express from 'express';

// Importing Product model
import Product from '../models/productModel.js';

const router = express.Router();

// Get all products
// GET @/api/products
// Public
router.get('/', async (req, res) => {
   try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get 10 latest products
// GET @/api/products/latest
// Public
router.get('/latest', async (req, res) => {
   try {
      const products = await Product.find().sort({ createdAt: -1 }).limit(10);

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get most rated products
// Get @/api/products/most/rated/products
// Public
router.get('/most/rated/products', async (req, res) => {
   try {
      const products = await Product.find({}).sort({ rating: -1 }).limit(3);

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
      }).sort({ createdAt: -1 }).limit(10)

      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get similar products
// Get /@api/products/similar/products/:category/:id
// Public
router.get('/similar/products/:category/:id', async(req, res) => {
   try{
      const products = await Product.find({ category: req.params.category, _id: { $ne: req.params.id } }).sort({ createdAt: -1 }).limit(10)

      res.status(200).json(products)
   }catch(err){
      res.status(500).json({ msg: 'An error occured!' });
   }
})

// Get products based on category
// Get /@api/products/category/products/:category
// Public
router.get('/category/products/:category', async (req, res) => {
   try{
      const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 }).limit(10)

      res.status(200).json(products)
   }catch(err){
      res.status(500).json({ msg: 'An error occured!' });
   }
})

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

// Create a new product as an admin
// PORT @/api/products
// Private
router.post('/', async (req, res) => {
   try {
      const { name, image, price, imageId, description, brand, category } =
         req.body;

      if (!name || !price)
         return res.status(400).json({ msg: 'Please enter all fields!' });

      const newProduct = new Product({
         name,
         image,
         price,
         imageId,
         description,
         brand,
         category,
      });

      const product = await newProduct.save();

      res.send(product);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured! Product not created!' });
   }
});
export default router;
