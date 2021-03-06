'use strict';
const faker = require('faker')
const bcrypt = require('bcrypt-nodejs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: true,
      name: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user2@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'John',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'user3@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      isAdmin: false,
      name: 'Jenny',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
    queryInterface.bulkInsert('Restaurants',
      Array.from({ length: 50 }).map(d =>
        ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          description: faker.lorem.text().substring(0, 200),
          CategoryId: Math.floor(Math.random() * 7) + 1,
          viewCounts: Math.floor(Math.random() * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});
    queryInterface.bulkInsert('Categories', ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'].map((item, index) => ({
      id: index + 1,
      name: item,
      createdAt: new Date(),
      updatedAt: new Date()
    })), {})
    return queryInterface.bulkInsert('Comments',
      Array.from({ length: 30 }).map(d =>
        ({
          text: faker.lorem.text().substring(0, 50),
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 50) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Categories', null, {})
    queryInterface.bulkDelete('Restaurants', null, {})
    return queryInterface.bulkDelete('Comments', null, {})
  }
};
