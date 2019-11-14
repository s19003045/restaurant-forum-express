const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')

const userController = {
  singIn: (req, res) => {
    userService.singIn(req, res, (data) => {
      return res.json(data)
    })
  },

  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserProfile: (req, res) => {
    userService.getUserProfile(req, res, (data) => {
      return res.json(data)
    })
  },
  putUserProfile: (req, res, callback) => {

    userService.putUserProfile(req, res, (data) => {
      return res.json(data)
    })
  },
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      return res.json(data)
    })
  },
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      return res.json(data)
    })
  },
  addLike: (req, res) => {
    userService.addLike(req, res, (data) => {
      return res.json(data)
    })
  },
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.json(data)
    })
  },

  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.json(data)
    })
  },

  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.json(data)
    })
  },

  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },

}
module.exports = userController