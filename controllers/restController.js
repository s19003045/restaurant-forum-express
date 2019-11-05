const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    let categoryId = ''
    let whereQuery = {}
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }

    Category.findAll()
      .then(categories => {
        Restaurant.findAll({ where: whereQuery, include: [Category] })
          .then(restaurants => {

            const data = restaurants.map(r => ({
              ...r.dataValues,
              description: r.dataValues.description.substring(0, 50) //重新定義 r.dataValues.description
            }))
            return res.render('restaurants', { restaurants: data, categories: categories, categoryId: categoryId })
          })
      })


    // if (req.query.categoryId) {

    // } else {
    //   Category.findAll()
    //     .then(categories => {
    //       Restaurant.findAll({ include: [Category] })
    //         .then(restaurants => {
    //           const data = restaurants.map(r => ({
    //             ...r.dataValues,
    //             description: r.dataValues.description.substring(0, 50) //重新定義 r.dataValues.description
    //           }))
    //           return res.render('restaurants', { restaurants: data, categories: categories, categoryId: 0 })
    //         })
    //     })
    // }
  },
  getRestaurant: (req, res) => {
    // console.log(req.params.id)
    if (!req.params.id) {
      req.flash('error_messages', 'link error')
      res.redirect('/restaurants')
    } else {
      Restaurant.findByPk(req.params.id, { include: Category })
        .then(restaurant => {
          res.render('restaurant', { restaurant })
        })
    }
  }
}

module.exports = restController