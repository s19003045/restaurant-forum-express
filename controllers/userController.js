const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
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
                console.log(user)
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
  }
}
module.exports = userController