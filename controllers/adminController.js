const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
// const fs = require('fs')
const Comment = db.Comment
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService')


const adminController = {
  // ======= restaurants ======
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  editRestaurant: (req, res) => {
    Category.findAll()
      .then(categories => {
        Restaurant.findByPk(req.params.id)
          .then(restaurant => {

            return res.render('admin/create', { restaurant, categories })
          })
      })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  createRestaurant: (req, res) => {
    return Category.findAll()
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
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

}

module.exports = adminController