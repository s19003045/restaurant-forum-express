const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')

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
    const { file } = req // equal to const file = req.file
    if (file) {
      // 先讀取檔案(readFile)，再寫入檔案(writeFile)
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
              restaurant.update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              }).then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
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
  }
}

module.exports = adminController