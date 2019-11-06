const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const limitPerPage = 10 //預設每頁筆數

const restController = {
  getRestaurants: (req, res) => {

    let categoryId = ''
    let whereQuery = {}
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    let pageNumber = Number(req.query.pageNumber) || 1 //預設顯示第一頁

    Category.findAll()
      .then(categories => {
        Restaurant.findAndCountAll({ where: whereQuery, include: [Category], limit: limitPerPage, offset: (pageNumber - 1) * limitPerPage })
          .then(restaurants => {
            // 總頁數 totalPage
            let totalPage = Math.ceil(restaurants.count / limitPerPage)
            // 頁數的陣列
            const pageList = Array.from({ length: totalPage }, (value, index) => index + 1)
            // 推算前一頁 prev
            let prev = pageNumber == 1 ? 1 : pageNumber - 1
            // 推算後一頁 nexgt
            let next = pageNumber == totalPage ? totalPage : pageNumber + 1
            // 限制 restaurant 的 description 字數
            const data = restaurants.rows.map(r => ({
              ...r.dataValues,
              description: r.dataValues.description.substring(0, 50)
            }))
            return res.render('restaurants', { restaurants: data, categories: categories, categoryId: categoryId, pageNumber: pageNumber, pageList: pageList, prev: prev, next: next })
          })
      })
  },
  getRestaurant: (req, res) => {
    // console.log(req.params.id)

    Restaurant.findByPk(req.params.id, {
      include: [
        Category, { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        console.log(restaurant)

        res.render('restaurant', { restaurant })
      })
  },
  getFeeds: (req, res) => {
    Restaurant.findAll({ order: [['createdAt', 'DESC']], limit: 10, include: [Category] })
      .then(restaurants => {
        Comment.findAll({ order: [['createdAt', 'DESC']], limit: 10, include: [User, Restaurant] })
          .then(comments => {
            return res.render('feeds', { restaurants, comments })
          })
      })

  }
}

module.exports = restController