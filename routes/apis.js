const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const userController = require('../controllers/api/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


// ===== admin route for restaurants =====
router.get('/admin', (req, res) => { res.redirect('/admin/restaurants') })

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)

router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)

router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

router.post('/admin/restaurants', upload.single('image'), authenticated, authenticatedAdmin, adminController.postRestaurant) //新增餐廳資料，只接受單一圖檔

router.put('/admin/restaurants/:id', upload.single('image'), authenticated, authenticatedAdmin, adminController.putRestaurant) //編輯餐廳資料，只接受單一圖檔

// ===== admin routes for category =====
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)

router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)

router.get('/admin/categories/:id/edit', authenticated, authenticatedAdmin, categoryController.getCategories)

router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)

router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)


// ===== user route =====
// JWT singIn
router.post('/signin', userController.singIn)

router.post('/signup', userController.signUp)

module.exports = router
