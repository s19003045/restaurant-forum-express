const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship


const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signUpPage')
  },
  signUp: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '密碼錯誤')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '已有人註冊此帳號')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {

                req.flash('success_messages', '你已成功註冊帳號')
                return res.redirect('/signin')
              })
          }

        })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '你已成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  // get user profile
  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: { model: Comment, include: [Restaurant] } })
      .then(user => {

        const data = user.Comments.map(r => (r.Restaurant.dataValues))
        // console.log('Restaurant:', data)
        return res.render('user', { user, loginUserId: req.user.id, restaurants: data }) //user 瀏灠頁面的 user，loginUserId 為登入者的 id
      })
  },
  editUser: (req, res) => {

    if (req.user.id !== Number(req.params.id)) {
      return res.redirect('/')
    } else {
      User.findByPk(req.params.id)
        .then(user => {

          return res.render('editUser', { user }) //user 瀏灠頁面的 user，loginUserId 為登入者的 id
        })
    }
  },


  putUser: (req, res) => {

    if (Number(req.params.id) !== Number(req.user.id)) {
      req.flash('error_messages', 'permission denied')
      return res.redirect('/')
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
              }).then((user) => {
                req.flash('success_messages', 'profile was successfully update')
                return res.redirect(`/users/${user.id}`)
              })
            })
        }
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name
          }).then((user) => {
            req.flash('success_messages', 'profile was successfully update')
            return res.redirect(`/users/${user.id}`)
          })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(favorite => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({ where: { RestaurantId: req.params.restaurantId, UserId: req.user.id } })
      .then(favorite => {

        favorite.destroy()
          .then(favorite => {
            return res.redirect('back')
          })
      })
  },
  addLike: (req, res) => {

    Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(like => {
        return res.redirect('back')
      })

  },
  removeLike: (req, res) => {

    Like.findOne({ where: { RestaurantId: req.params.restaurantId, UserId: req.user.id } })
      .then(restaurant => {
        restaurant.destroy()
          .then(restaurant => {
            return res.redirect('back')
          })
      })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      FollowerId: req.user.id,
      FollowingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        FollowerId: req.user.id,
        FollowingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },

  getTopUser: (req, res) => {
    // 先撈出所有使用者，並其 followers
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then(users => {
        // console.log(users)
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

        return res.render('topUser', { users })
      })
  }
}


module.exports = userController