const db = require('../../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
// const fs = require('fs')
const Comment = db.Comment
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../../services/adminService')

const adminController = {
  // ======= restaurants ======
  getRestaurants: (req, res) => {
    return adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    return adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  putRestaurant: (req, res) => {
    return adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
}

module.exports = adminController