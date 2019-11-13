const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  singIn: (req, res) => {
    // 檢查 email 及 password
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist"
      })
    }

    // 檢查 user 是否存在與密碼正確性
    let username = req.body.email
    let password = req.body.password

    User.findOne({ name: username })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: "no such user found"
          })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            status: 'error',
            message: "passwords did not match"
          })
        }

        //簽發 token
        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.json({
          status: 'success',
          message: 'ok',
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
  signUp: (req, res) => {
    if (!req.body.passwordCheck || !req.body.password || !req.body.email) {
      return res.json({
        status: 'error',
        message: '必填欄位不得為空'
      })
    }
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({
        status: 'error',
        message: '兩次密碼輸入不同！'
      })
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            return res.json({
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
                return res.json({
                  status: 'success',
                  message: '成功註冊帳號！'
                })
              })
          }
        })
    }
  }

}

module.exports = userController