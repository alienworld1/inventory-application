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
  const items = await Item.find({}, 'name category').populate({path: 'category', select: 'name'}).sort({name: 1}).exec();

  res.render('list', {
    title: 'List of Items',
    list: items,
  });
});

exports.item_detail = asyncHandler(async(req, res, next) => {
  const item = await Item.findById(req.params.id).populate({path: 'category', select: 'name'}).exec();

  if (item === null) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Item Detail',
    item: item,
  });
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
