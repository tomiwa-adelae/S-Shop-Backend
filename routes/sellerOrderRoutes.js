import express from 'express'

const router = express.Router()

import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

import {auth} from '../middleware/auth.js'
// Get all orders
// GET @/api/sellers/orders
// Private
router.get('/', auth, async(req, res) => {
	try{
		const orders = await Order.find().sort({ createdAt: -1 })

		res.status(200).json(orders)
	}catch(err) {
		console.log(err)
		res.status(500).json({ msg: 'An error occured!' })
	}
})

// Get a single order by Id
// GET @/api/sellers/orders/:id
// Private
router.get('/:id', auth, async(req, res) => {
	try{
		const order = await Order.findById(req.params.id)

		if(!order) return res.status(404).json({ msg: 'Order not found!' })

		const orderUser = await User.findById(order.user).select('-password')

		res.status(200).json({order, orderUser})
	}catch(err){
		console.log(err)
		res.status(500).json({ msg: 'An error occured!' })
	}
})

// Update order to paid
// PUT @/api/sellers/orders/:id/pay
// Private
router.put('/:id/pay', auth, async(req, res) => {
	try{
		const existingOrder = await Order.findById(req.params.id)

		if(!existingOrder) return res.status(404).json({ msg: 'An error occured!' })

		existingOrder.isPaid = true;
		existingOrder.paidAt = Date.now()

		const orderUser = await User.findById(existingOrder.user).select('-password')	

		const order = await existingOrder.save()

	res.status(200).json({order, orderUser})
	}catch(err){
		res.status(500).json({ msg: 'An error occured!' })
	}
})

// Update order to deliver
// PUT @/api/sellers/orders/:id/deliver/order
// Private
router.put('/:id/deliver/order', auth, async(req, res) => {
	try{
		const existingOrder = await Order.findById(req.params.id)

		if(!existingOrder) return res.status(404).json({ msg: 'An error occured!' })


		existingOrder.isDelivered = true;
		existingOrder.deliveredAt = Date.now()

	const orderUser = await User.findById(existingOrder.user).select('-password')	

		const order = await existingOrder.save()

	res.status(200).json({order, orderUser})
	}catch(err){
		res.status(500).json({ msg: 'An error occured!' })
	}
})

export default router