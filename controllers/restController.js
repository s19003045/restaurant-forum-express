const db = require('../models')
const Restaurant = db.Restaurant

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll()
      .then(restaurants => {
        console.log(restaurants)
        return res.render('restaurants', { restaurants })
      })
    // return res.render('restaurants')
  },
  getRestaurant: (req, res) => {
    // Restaurant.findOne({where:{id:}})
  }
}

module.exports = restController