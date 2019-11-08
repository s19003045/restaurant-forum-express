const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const faker = require('faker')

const commentController = {
  postComment: (req, res) => {

    Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.query.restaurantId
    })
      .then(comment => {

        return res.redirect(`/restaurants/${req.query.restaurantId}`)
      })
  },
  // ======== Comment ======
  deleteComment: (req, res) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then((comment) => {
            return res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  },
}

module.exports = commentController