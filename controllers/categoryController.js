const db = require('../models')
const User = db.User
const Category = db.Category
const categoryService = require('../services/categoryService')

const categoryController = {

  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('/admin/categories')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      req.flash('success_messages', data['message'])
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController