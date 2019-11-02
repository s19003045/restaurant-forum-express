const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll()
      .then(restaurants => {

        return res.render('admin/restaurants', { restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated })
      })

  },
  getRestaurant: (req, res) => {
    // console.log(req.params.id)
    Restaurant.findOne({ where: { id: req.params.id } })
      .then(restaurant => {
        // console.log(restaurant)
        return res.render('admin/restaurant', { restaurant })
      })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    console.log('file path:', file.path)
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      // 讀取暫存在 file.path 的 file，並上傳至 imgur API 
      imgur.upload(file.path, (err, img) => {
        console.log('img data link:', img.data.link)
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
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
        image: null
      })
        .then(restaurant => {
          req.flash('success_messages', 'restaurant was successfully created')

          res.redirect('/admin/restaurants')
        })
    }

  },
  editRestaurant: (req, res) => {
    console.log('editpage:', req.params.id)
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        console.log('restaurant name:', restaurant.name)
        return res.render('admin/create', { restaurant })
      })
  },
  putRestaurant: (req, res) => {
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
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
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
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
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
        if (user.isAdmin) {
          user.update({
            isAdmin: false
          }).then(() => {
            return res.redirect('/admin/users')
          })
        } else {
          user.update({
            isAdmin: true
          }).then(() => {
            return res.redirect('/admin/users')
          })
        }
      })
  },
}

module.exports = adminController