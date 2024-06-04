const asyncHandler = require('express-async-handler');

const Category = require('../models/categories');

exports.category_list = asyncHandler(async(req, res, next) => {
  const categories = await Category.find().exec();

  res.render('list', {title: 'List of categories', list: categories});
});

exports.category_detail = asyncHandler(async(req, res, next) => {
  res.send(`Not implemented: category detail: ${req.params.id}`);
});

exports.category_create_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category create GET');
});

exports.category_create_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category create POST');
});

exports.category_delete_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category delete GET');
});

exports.category_delete_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category delete POST');
});

exports.category_update_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category update GET');
});

exports.category_update_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: category update POST');
});
