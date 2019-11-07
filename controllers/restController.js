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
              description: r.dataValues.description.substring(0, 50),
              isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
              isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
            }))
            return res.render('restaurants', { restaurants: data, categories: categories, categoryId: categoryId, pageNumber: pageNumber, pageList: pageList, prev: prev, next: next })
          })
      })
  },
  getRestaurant: (req, res) => {
    // console.log(req.params.id)

    Restaurant.findByPk(req.params.id, {
      include: [
        Category, { model: Comment, include: [User] }, { model: User, as: 'FavoritedUsers' }, { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        console.log('restaurant:', restaurant)
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)

        const isLiked = restaurant.LikedUsers.map(r => r.id).includes(req.user.id)
        console.log('isLiked:', isLiked)

        restaurant.update({ viewCounts: (restaurant.viewCounts + 1) })
          .then(restaurant => {
            res.render('restaurant', { restaurant, isFavorited, isLiked })
          })
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

  },
  getDashboard: (req, res) => {
    Restaurant.findByPk(req.params.id, { include: [Comment, Category] })
      .then(restaurant => {

        let commentCount = restaurant.Comments.length
        return res.render('restDashboard', { commentCount, restaurant })

      })
  }
}

module.exports = restController