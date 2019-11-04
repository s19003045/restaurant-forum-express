const db = require('../models')
const Restaurant = db.Restaurant

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ limit: 1 })
      .then(restaurants => {

        return res.render('restaurants', { restaurants })
      })
    // return res.render('restaurants')
  },
  getRestaurant: (req, res) => {
    // Restaurant.findOne({where:{id:}})
  }
}

module.exports = restController