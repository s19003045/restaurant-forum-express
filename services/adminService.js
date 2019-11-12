const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category


const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      include: [Category]
    })
      .then(restaurants => {
        callback({ restaurants })
      })

  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findOne({
      include: [Category],
      where: { id: req.params.id }
    })
      .then(restaurant => {
        callback({ restaurant })
      })
  },

  getCategories: (req, res, callback) => {
    return Category.findAll()
      .then(categories => {
        return callback({ categories })

      })
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.destroy({
      where: { id: req.params.id }
    })
      .then(() => {
        callback({ status: 'success', message: '' })
      })
  },
}

module.exports = adminService

