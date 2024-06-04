const asyncHandler = require('express-async-handler');

const Item = require('../models/items');
const Category = require('../models/categories');

exports.index = asyncHandler(async(req, res, next) => {
  const [numItems, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Inventory Management',
    numItems: numItems,
    numCategories: numCategories,
  });
});

exports.item_list = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item list');
});

exports.item_detail = asyncHandler(async(req, res, next) => {
  res.send(`Not implemented: Item detail: ${req.params.id}`);
});

exports.item_create_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item create GET');
});

exports.item_create_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item create POST');
});

exports.item_delete_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item delete GET');
});

exports.item_delete_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item delete POST');
});

exports.item_update_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item update GET');
});

exports.item_update_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item update POST');
});
