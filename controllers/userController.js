const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User


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
  }
}

module.exports = userController