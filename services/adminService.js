const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.destroy({
      where: { id: req.params.id }
    })
      .then(() => {
        callback({
          status: 'success',
          message: ''
        })
      })
  },

  postRestaurant: (req, res, callback) => {
    const { name,
      tel, address,
      opening_hours,
      description,
      categoryId
    } = req.body

    if (!name) {
      return callback({
        status: 'error',
        message: "name didn't exist"
      })

    }
    const { file } = req // equal to const file = req.file

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      // 讀取暫存在 file.path 的 file，並上傳至 imgur API 
      imgur.upload(file.path, (err, img) => {

        return Restaurant.create({
          name: name,
          tel: tel,
          address: address,
          opening_hours: opening_hours,
          description: description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          return callback({
            status: 'success',
            message: "restaurant was successfully created"
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
        image: null,
        CategoryId: categoryId
      })
        .then(restaurant => {
          return callback({
            status: 'success',
            message: "restaurant was successfully created"
          })
        })
    }
  },

  putRestaurant: (req, res, callback) => {
    const { name,
      tel, address,
      opening_hours,
      description,
      categoryId
    } = req.body

    if (!req.body.name) {
      return callback({
        status: 'error',
        message: "name didn't exist"
      })
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
              return callback({
                status: 'success',
                message: "restaurant was successfully to update"
              })
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
            return callback({
              status: 'success',
              message: "restaurant was successfully to update"
            })
          })
        })
    }
  },
}

module.exports = adminService

