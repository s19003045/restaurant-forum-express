const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User


const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll()
      .then(restaurants => {
        // console.log(restaurants)
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

    return Restaurant.create({
      name: name,
      tel: tel,
      address: address,
      opening_hours: opening_hours,
      description: description
    })
      .then(restaurant => {
        req.flash('success_messages', '新增餐廳成功')
        // console.log(restaurant)
        res.redirect('/admin/restaurants')
      })
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

    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        })
          .then(restaurant => {
            req.flash('success_messages', '修改餐廳成功')
            res.redirect('/admin/restaurants')
          })

      })
  }
}


module.exports = adminController