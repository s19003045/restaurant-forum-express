const express = require('express')
const router = express.Router()
const passport = require('../config/passport')


const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })



const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// ===== restaurants route =====
router.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })

router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

router.get('/restaurants/top', authenticated, restController.getTopRestaurant)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)



router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// ===== admin route for restaurants =====
router.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })

router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)


router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant) //新增餐廳資料，只接受單一圖檔

router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant) //編輯餐廳資料，只接受單一圖檔

router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// ===== admin route for user =====
router.get('/admin/users', authenticatedAdmin, adminController.editUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

// ===== admin routes for category =====
router.get('/admin/categories', authenticatedAdmin, adminController.getCategories)
router.post('/admin/categories', authenticatedAdmin, adminController.postCategories)
router.get('/admin/categories/:id/edit', authenticatedAdmin, adminController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, adminController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, adminController.deleteCategory)

// ==== user route ====
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUser)

router.get('/users/:id', authenticated, userController.getUserProfile)

router.get('/users/:id/edit', authenticated, userController.editUserProfile)

router.put('/users/:id', authenticated, upload.single('image'), userController.putUserProfile)


// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)


module.exports = router
