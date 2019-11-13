const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category


const categoryService = {

  getCategories: (req, res, callback) => {
    return Category.findAll()
      .then(categories => {

        if (req.params.id) {
          return Category.findByPk(req.params.id)
            .then(category => {
              callback({
                category,
                categories
              })
            })
        } else {
          callback({ categories })
        }
      })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({
        status: 'error',
        message: 'name didn\'t exist'
      })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          callback({
            status: 'success',
            message: 'category was successfully created'
          })
        })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({
        status: 'error',
        message: "category name didn\'t exist"
      })
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update({
            name: req.body.name
          })
            .then((category) => {
              callback({
                status: 'success', message: `update category "${category.name}" successifully`
              })
            })
        })
    }
  },

  deleteCategory: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
          .then(() => {
            callback({
              status: 'success',
              message: `delete category "${category.name}" successifully`
            })
          })
      })
  }
}

module.exports = categoryService