
import express from 'express'
import cloudinary from '../middleware/cloudinary.js';


const router = express.Router()

// Upload a photo
// POST @/api/uploads
// Private
router.post('/', async(req, res) => {
	try{
		const {brandLogo} = req.body
		
		const uploadResponse = await cloudinary.v2.uploader.upload(brandLogo, {
			upload_preset: 'sshop'
		})

		res.status(201).json({
			brandLogo: uploadResponse.url,
			brandLogoId: uploadResponse.public_id
		})
	}catch(err){
		res.status(500).json({ msg: 'Something went wrong! Image not uploaded!' })
	}
})

export default router