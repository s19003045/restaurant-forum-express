const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })


// ===== admin route for restaurants =====
router.get('/admin', (req, res) => { res.redirect('/admin/restaurants') })

router.get('/admin/restaurants', adminController.getRestaurants)

router.get('/admin/restaurants/:id', adminController.getRestaurant)

router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant) //新增餐廳資料，只接受單一圖檔

router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant) //編輯餐廳資料，只接受單一圖檔

// ===== admin routes for category =====
router.get('/admin/categories', categoryController.getCategories)

router.post('/admin/categories', categoryController.postCategory)

router.get('/admin/categories/:id/edit', categoryController.getCategories)

router.put('/admin/categories/:id', categoryController.putCategory)

router.delete('/admin/categories/:id', categoryController.deleteCategory)


module.exports = router
