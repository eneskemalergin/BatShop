/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Product = require('../api/product/product.model');
var Catalog = require('../api/catalog/catalog.model');
var mainCatalog, home, books, clothing;

User.find({}).removeAsync()
  .then(function() {
    User.createAsync({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: process.env.ADMIN_PASSWORD || 'admin'
    })
    .then(function() {
      console.log('finished populating users');
    });
  });

Catalog
  .find({})
  .remove()
  .then(function () {
    return Catalog.create({ name: 'All'});
  })
  .then(function (catalog) {
    mainCatalog = catalog;
    return mainCatalog.addChild({name: 'Home'});
  })
  .then(function (category) {
    home = category._id;
    return mainCatalog.addChild({name: 'Books'});
  })
  .then(function (category) {
    books = category._id;
    return mainCatalog.addChild({name: 'Clothing'});
  })
  .then(function (category) {
    clothing = category._id;
    return Product.find({}).remove({});
  })
  .then(function() {
    return Product.create({
      title: 'Getting MEAN Book',
      imageUrl: '/assets/uploads/GettingMEAN.jpg',
      price: 30,
      stock: 250,
      categories: [books],
      description: 'Getting MEAN with Mongo, Express, Angular, and Node teaches readers how to develop web applications end-to-end using the MEAN stack.'
    }, {
      title: 'Star Wars T-Shirt 1',
      imageUrl: '/assets/uploads/SW-tshirt.jpeg',
      price: 12.99,
      stock: 100,
      categories: [clothing],
      description: 'Starry starry wars in the Star Wars® Mens Storm Trooper Painting T-Shirt in Black. Those in the know will love this Star Wars graphic tee and it will quickly rise to must-have status.'
    }, {
      title: 'Star Wars T-Shirt 2',
      imageUrl: '/assets/uploads/SW-tshirt2.jpeg',
      price: 12.99,
      stock: 50,
      categories: [clothing],
      description: 'Celebrate the beloved space epic with the sleek appeal of the Mens Star Wars Rebel Logo T-Shirt.'
    });
  })
  .then(function () {
    console.log('Finished populating Products with categories');
  })
  .then(null, function (err) {
    console.error('Error populating Products & categories: ', err);
  });
