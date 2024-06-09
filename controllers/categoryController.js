const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv').config();
const { body, validationResult } = require('express-validator');
const debug = require('debug');

const Category = require('../models/categories');
const Item = require('../models/items');

exports.category_list = asyncHandler(async(req, res, next) => {
  const categories = await Category.find().sort({name: 1}).exec();

  res.render('list', {title: 'List of categories', list: categories});
});

exports.category_detail = asyncHandler(async(req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: 'Category Detail',
    category: category,
  });
});

exports.category_create_get = asyncHandler(async(req, res, next) => {
  res.render('category_form', {title: 'Create Category'});
});

exports.category_create_post = [
  body('name', 'Category name must be specified')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'Description must contain at least 5 characters')
    .trim()
    .isLength({min: 5})
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({name: req.body.name, description: req.body.description});

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({name: req.body.name})
        .collation({locale: 'en', strength: 2})
        .exec();
      
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async(req, res, next) => {
  const [category, allItemsUnderCategory] = await Promise.all([
    Category.findById(req.params.id, 'name').exec(),
    Item.find({category: req.params.id}, 'name').exec(),
  ]);

  if (category === null) {
    res.redirect('/inventory/category');
  } else {
    res.render('category_delete', {
      title: 'Delete Category', 
      category: category, 
      category_items: allItemsUnderCategory
    });
  }
});

exports.category_delete_post = [
  body('password', 'The admin password is incorrect.')
    .equals(process.env.ADMIN_PASSWORD),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [category, allItemsUnderCategory] = await Promise.all([
      Category.findById(req.params.id, 'name').exec(),
      Item.find({category: req.params.id}, 'name').exec(),  
    ]);

    if (allItemsUnderCategory.length > 0) {
      res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsUnderCategory,
      });
      return;
    }

    if (!errors.isEmpty()) {
      res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsUnderCategory,
        errors: errors.array(),
      });
    } else {
      await Category.findByIdAndDelete(req.body.category_id).exec();
      res.redirect('/inventory/category');
    }
  }),
];

exports.category_update_get = asyncHandler(async(req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error('Category not found');
    err.status = 404;
    return next(err);
  }
  res.render('category_form', {
    title: 'Update Category',
    category: category,
  });
  
});

exports.category_update_post = [
  body('name', 'Category name must be specified')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'Description must contain at least 5 characters')
    .trim()
    .isLength({min: 5})
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    
    const category = new Category({name: req.body.name, description: req.body.description, _id: req.params.id});

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({name: req.body.name})
        .collation({locale: 'en', strength: 2})
        .exec();
      
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(category.url);
      }
    }
  }),
];
