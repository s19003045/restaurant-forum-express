const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
// const fs = require('fs')
const Comment = db.Comment
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // ======= restaurants ======
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated })
      })

  },
  getRestaurant: (req, res) => {

    Restaurant.findOne({ include: [Category], where: { id: req.params.id } })
      .then(restaurant => {

        return res.render('admin/restaurant', { restaurant })
      })
  },
  createRestaurant: (req, res) => {
    return Category.findAll()
      .then(categories => {

        return res.render('admin/create', { categories })
      })

  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      // 讀取暫存在 file.path 的 file，並上傳至 imgur API 
      imgur.upload(file.path, (err, img) => {
        console.log('img data link:', img.data.link)
        return Restaurant.create({
          name: name,
          tel: tel,
          address: address,
          opening_hours: opening_hours,
          description: description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {

          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: name,
        tel: tel,
        address: address,
        opening_hours: opening_hours,
        description: description,
        image: null,
        CategoryId: categoryId
      })
        .then(restaurant => {
          req.flash('success_messages', 'restaurant was successfully created')

          res.redirect('/admin/restaurants')
        })
    }

  },
  editRestaurant: (req, res) => {
    console.log('editpage:', req.params.id)
    Category.findAll()
      .then(categories => {
        Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            console.log('restaurant name:', restaurant.name)
            return res.render('admin/create', { restaurant, categories })
          })
      })
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      // 讀取暫存在 file.path 的 file，並上傳至 imgur API
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: name,
              tel: tel,
              address: address,
              opening_hours: opening_hours,
              description: description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: name,
            tel: tel,
            address: address,
            opening_hours: opening_hours,
            description: description,
            image: restaurant.image,
            CategoryId: categoryId
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    Restaurant.destroy({ where: { id: req.params.id } })
      .then(() => {
        res.redirect('/admin/restaurants')
      })
  },


  // ====== user =======
  editUsers: (req, res) => {
    User.findAll()
      .then(users => {
        res.render('admin/users', { users })
      })
  },
  putUsers: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          isAdmin: !user.isAdmin
        }).then(() => {
          return res.redirect('/admin/users')
        })
      })
  },
  // category
  getCategories: (req, res) => {
    return Category.findAll()
      .then(categories => {
        console.log(categories[0])
        if (req.params.id) {
          return Category.findByPk(req.params.id)
            .then(category => {
              return res.render('admin/categories', { category, categories })
            })
        } else {
          return res.render('admin/categories', { categories })
        }
      })
  },
  postCategories: (req, res) => {
    const { category } = req.body
    if (category) {
      Category.create({
        name: category
      })
        .then(category => {
          req.flash('success_messages', `create category "${category.name}" successifully`)
          console.log(category)
          res.redirect('/admin/categories')
        })
    } else {
      req.flash('error_messages', "category name didn't exist")
      res.redirect('admin/categories')
    }
  },
  putCategory: (req, res) => {
    console.log(req.params.id)
    if (!req.body.category) {
      req.flash('error_messages', 'category name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          console.log(category)
          category.update({
            name: req.body.category
          })
            .then((category) => {
              req.flash('success_messages', `update category "${category.name}" successifully`)
              return res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => {
            console.log(category.name)
            req.flash('success_messages', `delete category "${category.name}" successifully`)
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = adminController