const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category] })
      .then(restaurants => {
        console.log(restaurants)
        return res.render('admin/restaurants', { restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated })
      })

  },
  getRestaurant: (req, res) => {

    Restaurant.findOne({ include: [Category], where: { id: req.params.id } })
      .then(restaurant => {
        console.log(restaurant)
        return res.render('admin/restaurant', { restaurant })
      })
  },
  createRestaurant: (req, res) => {
    return Category.findAll()
      .then(categories => {
        console.log(categories[0])
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
}

module.exports = adminController