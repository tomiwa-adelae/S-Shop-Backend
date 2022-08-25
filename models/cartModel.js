import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
{
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}, cartItems: {
		type: Array,
		default: []
	}, id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
		}, size: {
			type: String
		}
},{ timestamps: true}
)

const Cart = mongoose.model('Cart', cartSchema)

export default Cart