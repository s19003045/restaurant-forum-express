const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {

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

  // restaurants route
  app.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })

  app.get('/restaurants', authenticated, restController.getRestaurants)

  // admin route
  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })

  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant) //新增餐廳資料，只接受單一圖檔

  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

  app.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant) //編輯餐廳資料，只接受單一圖檔

  app.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

  // admin/users
  app.get('/admin/users', authenticatedAdmin, adminController.editUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

  // category routes
  app.get('/admin/categories', authenticatedAdmin, adminController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, adminController.postCategories),
  app.get('/admin/categories/:id/edit', authenticatedAdmin, adminController.editCategory),
  app.put('/admin/categories/:id', authenticatedAdmin, adminController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, adminController.deleteCategory)

  // user route
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)


}