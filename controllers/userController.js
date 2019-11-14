const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const userService = require('../services/userService')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUpPage')
  },

  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }

      req.flash('success_messages', data['message'])
      return res.redirect('/signin')
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    userService.singIn(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/restaurants')
    })
  },

  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUserProfile: (req, res) => {
    User.findByPk(
      req.params.id,
      {
        include: [
          { model: Comment, include: [Restaurant] },
          { model: db.Restaurant, as: 'FavoritedRestaurants' },
          { model: db.Restaurant, as: 'LikedRestaurants' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }
    )
      .then(user => {

        user.CommentsRestaurants = []
        user.Comments.map((d) => {
          if (!user.CommentsRestaurants.map(d => d.id).includes(d.RestaurantId)) {
            user.CommentsRestaurants.push(d.Restaurant)
            return d
          }
        })

        return res.render('userProfile',
          {
            userProfile: user,
            loginUserId: req.user.id
          }
        )
      })
  },
  editUserProfile: (req, res) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect('/')
    } else {
      User.findByPk(req.params.id)
        .then(user => {
          return res.render('editUserProfile', { user }) //user 瀏灠頁面的 user，loginUserId 為登入者的 id
        })
    }
  },

  putUserProfile: (req, res) => {
    userService.putUserProfile(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }

      req.flash('success_messages', data['message'])
      return res.redirect(`/users/${req.params.id}`)
    })
  },

  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.redirect('back')
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },

}

module.exports = userController