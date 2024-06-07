const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv').config();

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
  const categories = await Category.find({}, 'name').sort({name : 1}).exec();

  res.render('item_form', {title: 'Create item', categories: categories});
});

exports.item_create_post = [
  body('name', 'Item name must be specified')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'Description must contain at least 5 characters')
    .trim()
    .isLength({min: 5})
    .escape(),
  body('category', 'Category must be specified')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('price')
    .trim()
    .isLength({min: 1})
    .withMessage('Price must be specified')
    .isFloat({gt: 0})
    .withMessage('Price must be a positive value')
    .toFloat(),
  body('number_in_stock')
    .trim()
    .isLength({min: 1})
    .withMessage('Number in stock must be specified')
    .isInt({gt: 0})
    .withMessage('Number in stock must be a positive integer')
    .toInt(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      const categories = await Category.find({}, 'name').sort({name: 1}).exec();
      res.render('item_form', {
        title: 'Create item',
        categories: categories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async(req, res, next) => {
  const item = await Item.findById(req.params.id, 'name').exec();

  if (item === null) {
    res.redirect('/inventory/items');
  }

  res.render('item_delete', {title: 'Delete item', item: item});
});

exports.item_delete_post = [
  body('password', 'The admin password is incorrect.')
    .equals(process.env.ADMIN_PASSWORD),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const item = await Item.findById(req.params.id, 'name').exec();
      res.render('item_delete', {
        title: 'Delete item',
        item: item,
        errors: errors.array(),
      });
      return;
    }

    await Item.findByIdAndDelete(req.body.item_id).exec();
    res.redirect('/inventory/item');
  }),
];

exports.item_update_get = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item update GET');
});

exports.item_update_post = asyncHandler(async(req, res, next) => {
  res.send('Not implemented: item update POST');
});
