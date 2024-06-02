const dotenv = require('dotenv').config();

const Item = require('./models/items');
const Category = require('./models/categories');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URL;

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

main().catch(err => console.log(err));

async function createCategory(index, name, description) {
  const category = new Category({name: name, description: description});
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createItem(index, name, description, category, price, number_in_stock) {
  const item = new Item({
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${item.name}`);
}

async function createCategories() {
  console.log('Creating categories...');
  await Promise.all([
    createCategory(
      0,
      'Fruits',
      'Fruits are the sweet and fleshy products of flowering plants that contain seeds. They grow on trees, vines, bushes, and other plants. Fruits come in a wide variety of colors, shapes, sizes, and flavors. Some common fruits include apples, oranges, bananas, grapes, strawberries, and mangoes. Fruits are an important part of a healthy diet as they are packed with vitamins, minerals, fiber, and antioxidants.',
    ),
    createCategory(
      1,
      'Dairy Products',
      'Dairy products are foods derived from the milk of mammals, primarily cows, goats, and sheep. These products include milk itself, as well as foods made from milk such as cheese, yogurt, butter, cream, and ice cream. Dairy products are rich sources of protein, calcium, vitamins, and other nutrients that are essential for human health and development.',
    ),
  ]);
}

async function createItems() {
  console.log('Creating items...');
  await Promise.all([
    createItem(
      0,
      'Apple',
      ' A crunchy, round fruit that varies in color from red to yellow to green. Apples have a slightly tart and sweet flavor.',
      categories[0],
      1.99,
      57,
    ),
    createItem(
      1,
      'Banana',
      'An elongated, curved fruit with a thick inedible peel. Bananas have a creamy texture and sweet taste when ripe',
      categories[0],
      0.59,
      74,
    ),
    createItem(
      2,
      'Orange',
      'A round, bright orange citrus fruit with a tough, dimpled rind. Oranges are juicy and have a sweet, tangy flavor.',
      categories[0],
      1.29,
      34,
    ),
    createItem(
      3,
      'Strawberry',
      'A small, heart-shaped red fruit with tiny seeds on the surface. Strawberries are sweet and slightly tart.',
      categories[0],
      3.99,
      64,
    ),
    createItem(
      4,
      'Pineapple',
      'A large, cylindrical tropical fruit with a tough, diamond-patterned skin.',
      categories[0],
      3.49,
      76,
    ),
    createItem(
      5,
      'Milk',
      'A white liquid produced by mammals, typically cows. Milk contains proteins, fats, carbohydrates, vitamins, and minerals. It has a slightly sweet flavor.',
      categories[1],
      3.49,
      77,
    ),
    createItem(
      6,
      'Cheddar Cheese',
      'A hard, yellow or white cheese made from cow\'s milk. Cheddar cheese has a slightly tangy and savory flavor, with a firm and smooth texture.',
      categories[1],
      4.99,
      86,
    ),
    createItem(
      7,
      'Greek yoghurt',
      'A thick, creamy yogurt made by straining out the whey from regular yogurt. Greek yogurt has a tangy taste and is high in protein.',
      categories[1],
      1.29,
      89,
    ),
  ]);
}