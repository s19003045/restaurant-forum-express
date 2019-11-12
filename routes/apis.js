const express = require('express')
const router = express.Router()


const adminController = require('../controllers/api/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


// ===== admin route for restaurants =====
router.get('/admin', (req, res) => { res.redirect('/admin/restaurants') })

router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurants/:id', adminController.getRestaurant)



// ===== admin routes for category =====
router.get('/admin/categories', adminController.getCategories)



module.exports = router
