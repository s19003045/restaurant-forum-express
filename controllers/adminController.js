const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User


const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll()
      .then(restaurants => {
        console.log(restaurants)
        return res.render('admin/restaurants', { restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated })
      })

  },
  getRestaurant: (req, res) => {
    // Restaurant.findOne({where:{id:}})
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

    return Restaurant.create({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description
    })
      .then(restaurant => {
        req.flash('success_messages', '新增餐廳成功')
        console.log(restaurant)
        res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController