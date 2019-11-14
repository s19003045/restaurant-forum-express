const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship


// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = {
  singIn: (req, res, callback) => {
    // 檢查 email 及 password
    if (!req.body.email || !req.body.password) {
      return callback({
        status: 'error',
        message: "required fields didn't exist"
      })
    }

    // 檢查 user 是否存在與密碼正確性
    let username = req.body.email
    let password = req.body.password

    User.findOne({
      where: {
        email: username
      }
    })
      .then(user => {
        if (!user) {
          return callback({
            status: 'error',
            message: "no such user found"
          })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback({
            status: 'error',
            message: "passwords did not match"
          })
        }

        //簽發 token
        var payload = {
          id: user.id,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        } //Signing a token with 1 day of expiration

        var token = jwt.sign(payload, process.env.JWT_SECRET)

        return callback({
          status: 'success',
          message: 'log in successifully',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        })
      })
  },

  signUp: (req, res, callback) => {

    if (!req.body.passwordCheck || !req.body.password || !req.body.email) {
      return callback({
        status: 'error',
        message: '必填欄位不得為空'
      })
    }
    if (req.body.passwordCheck !== req.body.password) {
      return callback({
        status: 'error',
        message: '兩次密碼輸入不同！'
      })
    } else {
      User.findOne({
        where: {
          email: req.body.email
        }
      })
        .then(user => {

          if (user) {
            return callback({
              status: 'error',
              message: '信箱重覆！'
            })
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                return callback({
                  status: 'success',
                  message: '成功註冊帳號！'
                })
              })
          }
        })
    }
  },
  // get user profile
  getUserProfile: (req, res, callback) => {

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
        return callback({
          userProfile: user,
          loginUserId: req.user.id
        })
      })
  },

  putUserProfile: (req, res, callback) => {

    if (!req.body.name) {
      return callback({
        status: 'error',
        message: 'name should not be blank'
      })
    }
    if (Number(req.params.id) !== Number(req.user.id)) {
      return callback({
        status: 'error',
        message: 'permission denied'
      })
    }
    const { file } = req

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)

      imgur.upload(file.path, (err, img) => {
        if (err) { console.log(err) } else {
          return User.findByPk(req.params.id)
            .then((user) => {

              user.update({
                name: req.body.name,
                image: file ? img.data.link : user.image,
              })
                .then((user) => {
                  return callback({
                    status: 'success',
                    message: 'profile was successfully update'
                  })
                })
            })
        }
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name
          })
            .then((user) => {
              return callback({
                status: 'success',
                message: 'profile was successfully update',
                user: user
              })
            })
        })
    }
  },

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(favorite => {
        return callback({
          status: 'success',
          message: 'successifully add favorite'
        })
      })
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        RestaurantId: req.params.restaurantId,
        UserId: req.user.id
      }
    })
      .then(favorite => {
        favorite.destroy()
          .then(favorite => {
            return callback({
              status: 'success',
              message: 'successifully remove favorite'
            })
          })
      })
  },

  addLike: (req, res, callback) => {
    Like.create({
      RestaurantId: req.params.restaurantId,
      UserId: req.user.id
    })
      .then(like => {
        return callback({
          status: 'success',
          message: 'successifully add like'
        })
      })

  },

  removeLike: (req, res, callback) => {
    Like.findOne({
      where: {
        RestaurantId: req.params.restaurantId,
        UserId: req.user.id
      }
    })
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return callback({
              status: 'success',
              message: 'successifully remove like'
            })
          })
      })
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      FollowerId: req.user.id,
      FollowingId: req.params.userId
    })
      .then((followship) => {
        return callback({
          status: 'success',
          message: 'successifully add Following'
        })
      })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        FollowerId: req.user.id,
        FollowingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return callback({
              status: 'success',
              message: 'successifully remove Following'
            })
          })
      })
  },

  getTopUser: (req, res, callback) => {
    // 先撈出所有使用者，並其 followers
    User.findAll({
      include: [{
        model: User,
        as: 'Followers'
      }]
    })
      .then(users => {

        // 整理 users 資料
        users = users.map(user => ({
          ...user.dataValues,
          // 計算追蹤者人數
          FollowerCount: user.Followers.length,
          // 該 user 是否被使用者追蹤者
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        // 依追蹤者人數排序清單
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)

        return callback({ users })
        // return res.render('topUser', { users })
      })
  },
}

module.exports = userService