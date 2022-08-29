import express from 'express'

const router = express.Router()

// Import Order model
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

// Get all orders
// GET @/api/orders
// Private
router.get('/', async(req, res) => {
	try{
		const orders = await Order.find().sort({ createdAt: -1 })

		res.status(200).json(orders)
	}catch(err) {
		res.status(500).json({ msg: 'An error occured!' })
	}
})

// Get a single order by Id
// GET @/api/orders/:id
// Private
router.get('/:id', async(req, res) => {
	try{
		const order = await Order.findById(req.params.id)

		if(!order) return res.status(404).json({ msg: 'Order not found!' })

		const orderUser = await User.findById(order.user).select('-password')

		res.status(200).json({order, orderUser})
	}catch(err){
		res.status(500).json({ msg: 'An error occured!' })
	}
})


// Create an order
// POST @/api/orders
// Private
router.post('/', async(req, res) => {
	try{
		const { user, cartItems, paymentMethod, location, totalPrice } = req.body

		if(cartItems.length === 0) return res.status(400).json({ msg: 'Cart is empty' })

			const newOrder = new Order({
				orderItems: cartItems,
				location, user, paymentMethod, totalPrice 
			})

		const order = await newOrder.save()

		const orderUser = await User.findById(user).select('-password')


		res.status(201).json({
			orderUser, order
		})
	}catch(err){
		res.status(500).json({ msg: 'An error occured!' })
	}
})

export default router