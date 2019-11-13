const express = require('express')
const router = express.Router()


const adminController = require('../controllers/api/adminController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


// ===== admin route for restaurants =====
router.get('/admin', (req, res) => { res.redirect('/admin/restaurants') })

router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant) //新增餐廳資料，只接受單一圖檔

// ===== admin routes for category =====
router.get('/admin/categories', adminController.getCategories)



module.exports = router
